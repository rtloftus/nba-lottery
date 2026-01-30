import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNBAStore } from "./store";
import "./index.css";
import "./css/PlayoffSim.css";

export default function PlayoffSim() {
  const navigate = useNavigate();
  const goBack = () => navigate("/standings");
  const continueToLottery = () => navigate("/lottery-odds");

  const { teams } = useNBAStore();
  const [playoffTeams, setPlayoffTeams] = useState([]);
  const [revealedTeams, setRevealedTeams] = useState([]);
  const [draftStarted, setDraftStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);
  const START_DELAY = 600;
  const EXTRA_GAP_BETWEEN_PICKS = 800;

  useEffect(() => {
    if (!teams || Object.keys(teams).length === 0) return;

    // Only include playoff teams, ordered by expected pick descending (30 → 15)
    const ordered = Object.entries(teams)
      .filter(([_, info]) => info.playoffs)
      .map(([name, info]) => ({
        name,
        wins: info.wins,
        losses: info.losses,
        expected: info.expected,
        tiebroken: info.tiebroken,
      }))
      .sort((a, b) => b.expected - a.expected);

    setPlayoffTeams(ordered);
  }, [teams]);

  const revealNext = () => {
    if (indexRef.current >= playoffTeams.length) {
      clearInterval(intervalRef.current);
      setFinished(true);
      return;
    }

    const nextTeam = playoffTeams[indexRef.current];
    if (nextTeam) {
      setRevealedTeams(prev => [...prev, nextTeam]);
      indexRef.current += 1;
    }

    if (indexRef.current >= playoffTeams.length) {
      clearInterval(intervalRef.current);
      setFinished(true);
    }
  };

  const startDraft = () => {
    if (playoffTeams.length === 0) return;

    setFinished(false);
    if (!draftStarted) {
      setDraftStarted(true);
      setRevealedTeams([]);
      indexRef.current = 0;
    }

    setPaused(false);
    clearInterval(intervalRef.current);
      // Delay before the first reveal
  setTimeout(() => {
    revealNext(); // show the first team
    // Then start normal pacing for the rest
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
      <h1>Playoff Team Draft Order</h1>
      <p className="subtitle">Ordered by record (ties broken randomly).</p>

      {!finished ? (
        <div className="button-row">
          <button
            onClick={draftStarted ? togglePause : startDraft}
            className="sticky-button"
          >
            {!draftStarted ? "⇓ Begin Non-Lottery Sim" : paused ? "▶ Resume" : "⏸ Pause"}
          </button>
        </div>
      ) : (
        <div className="button-row">
          <button onClick={goBack} style={{ backgroundColor: "#9f5d5dff" }}>
            ↺ Go Back
          </button>
          <button
            onClick={continueToLottery}
            style={{ backgroundColor: "#5d9f6eff" }}
          >
            Continue
          </button>
        </div>
      )}

      <div
        className="draft-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "16px",
        }}
      >
        {revealedTeams.map((team, i) => {
          const logoPath = `/logos/${team.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/\./g, "")
            .replace(/'/g, "")}.png`;

          return (
            <div
              key={team.name}
              className="draft-card revealed"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="draft-pick-number">
                #{team.expected} {team.tiebroken && "⛁"}
              </div>
              <img
                src={logoPath}
                alt={`${team.name} logo`}
                className="draft-team-logo"
              />
              <div className="draft-team-name">{team.name}</div>
              <div className="draft-record">
                {team.wins}-{team.losses}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
