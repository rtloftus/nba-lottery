import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNBAStore } from "./store";
import "./index.css";

export default function LotteryOdds() {
  const navigate = useNavigate();
  const { teams, updateTeam } = useNBAStore();
  const [lotteryTeams, setLotteryTeams] = useState([]);

    useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const goBack = () => navigate("/");
  const continueToLottery = () => navigate("/lottery-sim");

  useEffect(() => {
    if (!teams || Object.keys(teams).length === 0) return;

    const all = Object.entries(teams).map(([name, info]) => ({
      name,
      wins: info.wins,
      losses: info.losses,
      playoffs: info.playoffs,
      conference: info.conference,
      combos: info.combos ?? 0,
      expected: info.expected ?? 0,
    }));

    const nonPlayoff = all.filter(t => !t.playoffs).sort((a, b) => a.wins - b.wins);

    let start = 1;
    const ranges = nonPlayoff.map(t => {
      const end = start + t.combos - 1;
      const range = { ...t, start, end };
      start = end + 1;
      return range;
    });

    const totalCombos = start - 1;

    const drawRandom = () => {
      let num = Math.floor(Math.random() * 1001) + 1;
      while (num > totalCombos || num === 1001) {
        console.log(`Reroll: invalid number ${num} (must be ≤ ${totalCombos})`);
        num = Math.floor(Math.random() * 1001) + 1;
      }
      return num;
    };

    const winners = [];
    const chosenNames = new Set();

    console.log("=== LOTTERY DRAW START ===");
    console.log(`Total combinations available: ${totalCombos}`);

    while (winners.length < 4) {
      let num = drawRandom();
      let winner = ranges.find(t => num >= t.start && num <= t.end);

      if (!winner) {
        console.log(`Reroll: number ${num} not found in any range`);
        continue;
      }

      if (chosenNames.has(winner.name)) {
        console.log(`Reroll: number ${num} fell on ${winner.name}, already selected`);
        continue;
      }

      winners.push(winner);
      chosenNames.add(winner.name);
      console.log(
        `Pick ${winners.length}: ${winner.name} wins with draw #${num} (range ${winner.start}-${winner.end})`
      );
    }

    console.log("=== LOTTERY DRAW COMPLETE ===");
    console.log("Selected teams (in order):", winners.map(w => w.name));

    const remaining = ranges
      .filter(t => !chosenNames.has(t.name))
      .sort((a, b) => a.wins - b.wins || a.expected - b.expected);

    const finalList = [
      ...winners.map((t, i) => ({ ...t, actual: i + 1 })),
      ...remaining.map((t, i) => ({ ...t, actual: i + 5 })),
    ]
      .map(t => ({
        ...t,
        pct: ((t.combos / 1000) * 100).toFixed(1),
      }))
      .sort((a, b) => a.expected - b.expected); // sort by expected pick ascending (worst to best)

    setLotteryTeams(finalList);
  }, []); // run once

  const confirmResults = () => {
    for (const t of lotteryTeams) {
      updateTeam(t.name, { actual: t.actual });
    }
    continueToLottery();
  };

  const renderLotteryList = list => (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {list.map((t, i) => {
        const logoPath = `/logos/${t.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/\./g, "")
          .replace(/'/g, "")}.png`;

        return (
          <li
            key={t.name}
            className="lottery-team"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "8px",
              marginBottom: "6px",
            }}
          >
            <img
              src={logoPath}
              alt={`${t.name} logo`}
              className = "lottery-team-logo"
              style={{ width: "30px", height: "30px", objectFit: "contain" }}
            />
            <span style={{ width: "22px" }}>{t.expected ?? "–"}.</span>
            <span style={{ flexGrow: 1 }}>{t.name}</span>
            <span>
              ({t.wins}-{t.losses})
            </span>
            <span style={{ marginLeft: "8px", fontWeight: 600 }}>{t.pct}%</span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="app-container">
      <h1 style={{ textAlign: "center" }}>Odds for 1st Overall Pick</h1>
      <p className="subtitle" style={{ textAlign: "center" }}>
        Teams sorted by expected draft position.
      </p>

      <div className="lottery-list">{renderLotteryList(lotteryTeams)}</div>

      <div className="button-row">
        <button onClick={goBack} style={{ backgroundColor: "#9f5d5dff", marginBottom: "0px" }}>
          ↺ Go Back
        </button>
        <button onClick={confirmResults} style={{ backgroundColor: "#5d9f6eff", marginBottom: "0px" }}>
          Confirm & Continue
        </button>
      </div>
    </div>
  );
}
