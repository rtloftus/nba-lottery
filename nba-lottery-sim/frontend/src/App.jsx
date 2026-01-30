import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNBAStore } from "./store";
import "./index.css";

export default function App() {
  const navigate = useNavigate();
  const { teams, setTeams, updateTeam } = useNBAStore();
  const [errors, setErrors] = useState({});

  // Static team setup, since no backend
  const TEAMS = {
    "Atlanta Hawks": "East", "Boston Celtics": "East", "Brooklyn Nets": "East",
    "Charlotte Hornets": "East", "Chicago Bulls": "East", "Cleveland Cavaliers": "East",
    "Dallas Mavericks": "West", "Denver Nuggets": "West", "Detroit Pistons": "East",
    "Golden State Warriors": "West", "Houston Rockets": "West", "Indiana Pacers": "East",
    "Los Angeles Clippers": "West", "Los Angeles Lakers": "West", "Memphis Grizzlies": "West",
    "Miami Heat": "East", "Milwaukee Bucks": "East", "Minnesota Timberwolves": "West",
    "New Orleans Pelicans": "West", "New York Knicks": "East", "Oklahoma City Thunder": "West",
    "Orlando Magic": "East", "Philadelphia 76ers": "East", "Phoenix Suns": "West",
    "Portland Trail Blazers": "West", "Sacramento Kings": "West", "San Antonio Spurs": "West",
    "Toronto Raptors": "East", "Utah Jazz": "West", "Washington Wizards": "East"
  };

  useEffect(() => {
  if (!Object.keys(teams).length) {
    // Initialize if empty
    const init = {};
    Object.entries(TEAMS).forEach(([name, conf]) => {
      init[name] = {
        wins: "",
        losses: "",
        playoffs: false,
        expected: null,
        actual: null,
        combos: null,
        tiebroken: false,
        secondrd: null,
        conference: conf
      };
    });
    setTeams(init);
  } else {
    // One-time cleanup of legacy fields
    const hasLegacyFields = Object.values(teams).some(
      t => "pct" in t || "odds" in t
    );

    if (hasLegacyFields) {
      const cleaned = {};
      for (const [name, t] of Object.entries(teams)) {
        const { pct, odds, ...rest } = t;
        cleaned[name] = rest;
      }
      // ✅ clean once, then stop
      setTeams(cleaned);
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // run only once

  const handleWinChange = (team, value) => {
    const wins = value === "" ? "" : Number(value);
    updateTeam(team, {
      wins,
      losses: wins === "" || isNaN(wins) ? "" : 82 - wins
    });
    setErrors(prev => ({
      ...prev,
      [team]: wins === "" || isNaN(wins) || wins < 0 || wins > 82
    }));
  };

  const handlePlayoffChange = team => {
    updateTeam(team, { playoffs: !teams[team]?.playoffs });
  };

  const validateTeams = () => {
    const newErrors = {};
    let valid = true;

    Object.entries(teams).forEach(([name, info]) => {
      const w = info.wins;
      if (w === "" || isNaN(w) || w < 0 || w > 82) {
        newErrors[name] = true;
        valid = false;
      }
    });

    const counts = ["East", "West"].map(conf =>
      Object.values(teams).filter(t => t.conference === conf && t.playoffs).length
    );

    if (!counts.every(c => c === 8)) {
      alert("Exactly 8 teams per conference must be marked as playoff teams.");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const submitWins = () => {
    if (!validateTeams()) return;

    const updatedTeams = Object.fromEntries(
      Object.entries(teams).map(([name, info]) => [
        name,
        { ...info, wins: Number(info.wins), losses: 82 - Number(info.wins) }
      ])
    );

    setTeams(updatedTeams);
    navigate("/standings");
  };

  const fillRandomWins = () => {
  const updated = {};
  const conferenceTeams = { East: [], West: [] };

  Object.entries(teams).forEach(([name, info]) => {
    const wins = Math.floor(Math.random() * 83);
    const losses = 82 - wins;

    const team = {
      ...info,
      wins,
      losses,
      playoffs: false,    // reset playoff flags
      expected: null,
      actual: null,
      combos: null,
      tiebroken: false,
      secondrd: null
    };

    updated[name] = team;
    conferenceTeams[info.conference].push({ ...team, name });
  });

  ["East", "West"].forEach(conf => {
    const sorted = conferenceTeams[conf].sort((a, b) => b.wins - a.wins);
    sorted.slice(0, 8).forEach(t => {
      updated[t.name].playoffs = true;
    });
  });

  setTeams(updated);
  setErrors({});
};



  const clearWins = () => {
    const cleared = Object.fromEntries(
      Object.entries(teams).map(([name, info]) => [
        name,
        { ...info, wins: "", losses: "", playoffs: false }
      ])
    );
    setTeams(cleared);
    setErrors({});
  };

  const renderTeamInput = (name, info) => (
    <div key={name} className="team-item">
      <img
        className="team-logo"
        src={`/logos/${name.toLowerCase().replace(/\s+/g, "-").replace(/[.'"]/g, "")}.png`}
        alt={`${name} logo`}
      />
      <div className="team-item-label">{name}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <input
          type="number"
          value={info.wins ?? ""}
          placeholder="-"
          onChange={e => handleWinChange(name, e.target.value)}
          min={0}
          max={82}
          style={{ border: errors[name] ? "2px solid red" : "1px solid #ccc", width: "60px" }}
        />
        <input
          type="checkbox"
          checked={!!info.playoffs}
          onChange={() => handlePlayoffChange(name)}
          title="Made Playoffs"
        />
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <h1 style={{ textAlign: "center" }}>NBA Draft Lottery Simulator</h1>
      <p className="subtitle" style={{ textAlign: "center" }}>
        Enter wins (0–82) and select playoff teams below.
      </p>

      <div className="grids-container">
        {["East", "West"].map(conf => (
          <div key={conf} className="conference-grid">
            <h2>{conf}</h2>
            <div className="team-grid">
              {Object.entries(teams)
                .filter(([_, info]) => info.conference === conf)
                .map(([name, info]) => renderTeamInput(name, info))}
            </div>
          </div>
        ))}
      </div>

      <div className="button-row">
        <button onClick={clearWins} style={{ backgroundColor: "#9f5d5dff" }}>
          ✕ Clear
        </button>
        <button onClick={fillRandomWins}>⁝ Autofill Wins</button>
        <button onClick={submitWins} style={{ backgroundColor: "#5d9f6eff" }}>
          ✓ Submit
        </button>
      </div>
    </div>
  );
}
