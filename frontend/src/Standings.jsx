import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNBAStore } from "./store";
import "./index.css";

export default function Standings() {
  const navigate = useNavigate();
  const { teams, setTeams } = useNBAStore();
  const [eastTeams, setEastTeams] = useState([]);
  const [westTeams, setWestTeams] = useState([]);

  useEffect(() => {
    if (!teams || Object.keys(teams).length === 0) return;

    const updated = { ...teams };

    const processConference = conf => {
      const confTeams = Object.entries(updated)
        .filter(([_, info]) => info.conference === conf)
        .map(([name, info]) => ({ name, ...info }))
        .sort((a, b) => b.wins - a.wins);

      const playoffTeams = confTeams.filter(t => t.playoffs);
      confTeams.forEach(t => (updated[t.name].tiebroken = false));

      for (let i = 0; i < playoffTeams.length; i++) {
        const tied = playoffTeams.filter(t => t.wins === playoffTeams[i].wins);
        if (tied.length > 1) {
          const shuffled = [...tied].sort(() => Math.random() - 0.5);
          shuffled.forEach(t => (updated[t.name].tiebroken = true));
        }
        i += tied.length - 1;
      }

      let rank = 1;
      playoffTeams.forEach(t => {
        updated[t.name].expected = rank;
        updated[t.name].actual = rank;
        updated[t.name].combos = 0;
        rank++;
      });
    };

    processConference("East");
    processConference("West");

    // --- Playoff ordering across both conferences ---
    const allPlayoffTeams = Object.entries(updated)
      .filter(([_, t]) => t.playoffs)
      .map(([name, info]) => ({ name, ...info }))
      .sort((a, b) => b.wins - a.wins);

    const groupedPlayoffs = {};
    for (const t of allPlayoffTeams) {
      if (!groupedPlayoffs[t.wins]) groupedPlayoffs[t.wins] = [];
      groupedPlayoffs[t.wins].push(t);
    }

    const orderedPlayoffs = Object.keys(groupedPlayoffs)
      .map(Number)
      .sort((a, b) => b - a)
      .flatMap(wins => {
        const group = groupedPlayoffs[wins];
        if (group.length > 1) {
          const shuffled = [...group].sort(() => Math.random() - 0.5);
          shuffled.forEach(t => (updated[t.name].tiebroken = true));
          return shuffled;
        }
        return group;
      });

    orderedPlayoffs.slice(0, 16).forEach((t, i) => {
      updated[t.name].expected = 30 - i;
      updated[t.name].actual = 30 - i;
    });

    // --- Lottery (non-playoff) teams ---
    const lotteryTeams = Object.entries(updated)
      .filter(([_, t]) => !t.playoffs)
      .map(([name, info]) => ({ name, ...info }))
      .sort((a, b) => a.wins - b.wins);

    const combosList = [140, 140, 140, 125, 105, 90, 75, 60, 45, 30, 20, 15, 10, 5];
    const groupedLottery = {};
    for (const t of lotteryTeams) {
      if (!groupedLottery[t.wins]) groupedLottery[t.wins] = [];
      groupedLottery[t.wins].push(t);
    }

    let currentPos = 1;

    Object.keys(groupedLottery)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach(wins => {
        const group = groupedLottery[wins];
        const size = group.length;

        const start = currentPos - 1;
        const end = start + size;

        const subset = combosList.slice(start, end);
        const total = subset.reduce((a, b) => a + b, 0);
        const avg = total / size;

        const base = Math.floor(avg);
        let remainder = Math.round((avg - base) * size);

        const shuffled = [...group].sort(() => Math.random() - 0.5);

        shuffled.forEach((t, i) => {
          const extra = remainder > 0 ? 1 : 0;
          if (extra) remainder--;
          updated[t.name].expected = currentPos + i;
          updated[t.name].combos = base + extra;
          updated[t.name].tiebroken = size > 1;
        });

        currentPos += size;
      });

 // --- Second-round order (all 30 teams sorted by record) ---
const allTeamsByRecord = Object.entries(updated)
  .map(([name, info]) => ({ name, ...info }))
  .sort((a, b) => a.wins - b.wins); // lowest wins = earliest pick

const groupedByWins = {};
for (const t of allTeamsByRecord) {
  if (!groupedByWins[t.wins]) groupedByWins[t.wins] = [];
  groupedByWins[t.wins].push(t);
}

const finalSecondRound = Object.keys(groupedByWins)
  .map(Number)
  .sort((a, b) => a - b)
  .flatMap(w => {
    const group = groupedByWins[w];
    if (group.length > 1) {
      const shuffled = [...group].sort(() => Math.random() - 0.5);
      shuffled.forEach(t => (updated[t.name].tiebroken = true));
      return shuffled;
    }
    return group;
  });

// offset by 30 so second-round picks are 31–60
finalSecondRound.forEach((t, i) => {
  updated[t.name].secondrd = i + 31;
});

console.log("=== SECOND ROUND ORDER ===");
finalSecondRound.forEach((t, i) => console.log(`#${i + 31}: ${t.name}`));


    // --- Build conference standings for display ---
    const east = Object.entries(updated)
      .filter(([_, info]) => info.conference === "East")
      .map(([name, info]) => ({ name, ...info }))
      .sort((a, b) => b.wins - a.wins);

    const west = Object.entries(updated)
      .filter(([_, info]) => info.conference === "West")
      .map(([name, info]) => ({ name, ...info }))
      .sort((a, b) => b.wins - a.wins);

    setEastTeams(east);
    setWestTeams(west);
    setTeams(updated);
  }, []);

  const goBack = () => navigate("/");

  const handleConfirm = () => {
    navigate("/playoff-sim");
  };

  const renderTeamList = teamsList => (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {teamsList.map((t, i) => {
        const logoPath = `/logos/${t.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/\./g, "")
          .replace(/'/g, "")}.png`;

        return (
          <li
            key={t.name}
            className={t.playoffs ? "playoff-team" : ""}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "flex-start",
            }}
          >
            <img
              src={logoPath}
              alt={`${t.name} logo`}
              style={{ width: "30px", height: "30px", objectFit: "contain" }}
            />
            {i + 1}. {t.name} ({t.wins}-{t.losses})
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="app-container">
      <h1 style={{ textAlign: "center" }}>Final Conference Standings</h1>
      <p className="subtitle" style={{ textAlign: "center" }}>
        Confirm the final standings before continuing.
      </p>

      <div className="grids-container">
        <div className="conference-grid">
          <h2>East</h2>
          {renderTeamList(eastTeams)}
        </div>
        <div className="conference-grid">
          <h2>West</h2>
          {renderTeamList(westTeams)}
        </div>
      </div>

      <div className="button-row">
        <button onClick={goBack} style={{ backgroundColor: "#9f5d5dff" }}>
          ↺ Go Back
        </button>
        <button onClick={handleConfirm} style={{ backgroundColor: "#5d9f6eff" }}>
          ⋯ Continue
        </button>
      </div>
    </div>
  );
}
