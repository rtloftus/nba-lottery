import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNBAStore } from "./store";
import "./index.css";
import "./css/LotterySim.css";

export default function LotterySim() {
  const navigate = useNavigate();
  const goBack = () => navigate("/lottery-odds");
  const continueToSecond = () => navigate("/second-round");
  const EXPECTED_TO_ACTUAL_DELAY = 2200; // milliseconds
  const EXTRA_GAP_BETWEEN_PICKS = 4000; // optional pause after reveal
  const revealGap = EXPECTED_TO_ACTUAL_DELAY + EXTRA_GAP_BETWEEN_PICKS;
  const START_DELAY = 1000; // first reveal comes quicker


  const teams = useNBAStore(s => s.teams);

  const [lotteryTeams, setLotteryTeams] = useState([]);
  const [revealedTeams, setRevealedTeams] = useState([]);
  const [revealedStates, setRevealedStates] = useState({});
  const [actualRevealed, setActualRevealed] = useState({});
  const [draftStarted, setDraftStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);

  const intervalRef = useRef(null);
  const indexRef = useRef(0);
  const TOTAL_COMBOS = 1000;

  function recalculateExpectedOrder(all_teams_expected) {
    const masterList = [...all_teams_expected]
      .filter(t => t && t.expected != null && t.actual != null)
      .sort((a, b) => b.expected - a.expected);

    const confirmed = [];
    for (let i = 0; i < masterList.length; i++) {
      const current = masterList[i];
      const prev = i > 0 ? masterList[i - 1] : null;
      if (confirmed.length >= 10) break;
      const prevMovedUp =
        prev
          ? prev.actual < prev.expected ||
            (prev.actual === prev.expected && prev.actual <= 4)
          : false;
      if (!prevMovedUp) confirmed.push(current);
    }

    const topFour = [...all_teams_expected]
      .filter(t => t && t.actual != null && t.actual <= 4)
      .sort((a, b) => a.actual - b.actual);

    const adjustedTopFour = [...topFour];
    for (let i = 0; i < adjustedTopFour.length - 1; i++) {
      const curr = adjustedTopFour[i];
      const next = adjustedTopFour[i + 1];
      if (curr.expected > next.expected) adjustedTopFour[i + 1] = curr;
    }

    const reversedTopFour = [...adjustedTopFour].reverse();
    const finalOrder = [...confirmed, ...reversedTopFour].slice(0, 14);
    return [...finalOrder].reverse();
  }

  useEffect(() => {
    if (!teams || Object.keys(teams).length === 0) return;

    const nonPlayoff = Object.entries(teams)
      .filter(([_, info]) => !info.playoffs)
      .map(([name, info]) => ({
        name,
        wins: info.wins,
        losses: info.losses,
        odds: info.combos ?? 0,
        expected: info.expected ?? null,
        actual: info.actual ?? null,
      }))
      .filter(t => t.expected !== null)
      .sort((a, b) => a.expected - b.expected);

    const top4Actuals = nonPlayoff
      .filter(t => t.actual <= 4)
      .sort((a, b) => a.actual - b.actual)
      .map(t => t.name);

    const newExpectedList = recalculateExpectedOrder(nonPlayoff, top4Actuals);

    const ordered = nonPlayoff
      .map(t => {
        const expectedTeam = newExpectedList[t.actual - 1] || null;
        return { pick: t.actual, expectedTeam, actualTeam: t };
      })
      .sort((a, b) => b.pick - a.pick);

    setLotteryTeams(ordered);
    setRevealedTeams([]);
    setRevealedStates({});
    setActualRevealed({});
    setDraftStarted(false);
    setPaused(false);
    setFinished(false);
    indexRef.current = 0;
  }, [teams]);

  const revealNext = () => {
    if (indexRef.current >= lotteryTeams.length) {
      clearInterval(intervalRef.current);
      setFinished(true);
      return;
    }

    const nextSlot = lotteryTeams[indexRef.current];
    setRevealedTeams(prev => [...prev, nextSlot]);

    // Step 1: reveal expected
    setRevealedStates(prev => ({ ...prev, [nextSlot.pick]: true }));

    // Step 2: after short delay, reveal actual
    setTimeout(() => {
      setActualRevealed(prev => ({ ...prev, [nextSlot.pick]: true }));
    }, EXPECTED_TO_ACTUAL_DELAY);

    indexRef.current += 1;
    if (indexRef.current >= lotteryTeams.length) {
      clearInterval(intervalRef.current);
      setFinished(true);
    }
  };

  

const startDraft = () => {
  if (lotteryTeams.length === 0) return;
  setFinished(false);
  if (!draftStarted) {
    setDraftStarted(true);
    setRevealedTeams([]);
    setRevealedStates({});
    setActualRevealed({});
    indexRef.current = 0;
  }
  setPaused(false);
  clearInterval(intervalRef.current);

  // First pick reveals faster
  setTimeout(() => {
    revealNext(); // show first pick
    // Then start normal interval for the rest
    intervalRef.current = setInterval(revealNext, EXTRA_GAP_BETWEEN_PICKS);
  }, START_DELAY);
};


  const togglePause = () => {
    if (!draftStarted) return;
    if (paused) {
      setPaused(false);
      intervalRef.current = setInterval(revealNext, EXTRA_GAP_BETWEEN_PICKS);
    } else {
      setPaused(true);
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="app-container">
      <h1>NBA Draft Lottery</h1>
      <p className="subtitle">
        Expected order shows first, then reveals the actual team.
      </p>

      {!finished ? (
        <div className="button-row">
          <button
            onClick={draftStarted ? togglePause : startDraft}
            className="sticky-button"
          >
            {!draftStarted ? "⇓ Begin Reveal" : paused ? "▶ Resume" : "⏸ Pause"}
          </button>
        </div>
      ) : (
        <div className="button-row">
          <button onClick={goBack} style={{ backgroundColor: "#9f5d5dff" }}>
            Go Back
          </button>
          <button onClick={continueToSecond} style={{ backgroundColor: "#5d9f6eff" }}>
            Continue
          </button>
        </div>
      )}

      <div className="draft-grid">
        {revealedTeams.map((slot, i) => {
          const pickNumber = 14 - i;
          const expectedShown = !!revealedStates[slot.pick];
          const actualShown = !!actualRevealed[slot.pick];

          const formatLogo = name =>
            `/logos/${name.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "").replace(/'/g, "")}.png`;

          const expectedLogoPath = slot.expectedTeam
            ? formatLogo(slot.expectedTeam.name)
            : null;
          const actualLogoPath = slot.actualTeam
            ? formatLogo(slot.actualTeam.name)
            : null;

          return (
            <div key={slot.pick} className="draft-card fade-in">
              {!expectedShown && (
                <div className="pre-reveal">
                  <p className="expected-text">#{pickNumber} — ???</p>
                </div>
              )}

              {expectedShown && !actualShown && (
                <div className="expected-view fade-in">
                  <p className="expected-text"> Projected
                    #{pickNumber}: {slot.expectedTeam?.name ?? "—"}{" "}
                    <span className="expected-odds">
                      ({(((slot.expectedTeam?.odds ?? 0) / TOTAL_COMBOS) * 100).toFixed(1)}%)
                    </span>
                  </p>
                </div>
              )}

              {actualShown && (
                <div className="actual-view fade-in">
                  <div className="draft-pick-number">#{pickNumber}</div>
                  {actualLogoPath && (
                    <img
                      src={actualLogoPath}
                      alt={slot.actualTeam?.name}
                      className="draft-team-logo"
                    />
                  )}
                  <div className="draft-team-name">{slot.actualTeam?.name ?? "—"}</div>
                  <div className="draft-record">
                    {slot.actualTeam?.wins}-{slot.actualTeam?.losses} |{" "}
                    {(((slot.actualTeam?.odds ?? 0) / TOTAL_COMBOS) * 100).toFixed(1)}%
                  </div>
                  {slot.expectedTeam?.name &&
                    slot.expectedTeam.name !== slot.actualTeam?.name &&
                    expectedLogoPath && (
                      <div className="expected-preview">
                        <img
                          src={expectedLogoPath}
                          alt="expected team"
                          title="Expected"
                        />
                      </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
