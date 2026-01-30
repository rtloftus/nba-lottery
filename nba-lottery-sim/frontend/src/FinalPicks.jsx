import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNBAStore } from "./store";
import "./index.css";

export default function FinalPicks() {
  const navigate = useNavigate();
  const { teams } = useNBAStore();
  const [firstRound, setFirstRound] = useState([]);
  const [secondRound, setSecondRound] = useState([]);

  useEffect(() => {
    if (!teams || Object.keys(teams).length === 0) return;

    const teamList = Object.entries(teams).map(([name, info]) => ({
      name,
      ...info,
    }));

    const first = teamList
      .filter(t => t.actual)
      .sort((a, b) => a.actual - b.actual);

    const second = teamList
      .filter(t => t.secondrd)
      .sort((a, b) => a.secondrd - b.secondrd);

    setFirstRound(first);
    setSecondRound(second);
  }, [teams]);

  const goBack = () => navigate("/");
  const exportPicks = () => {
  window.print();
};

  const renderPickList = (list, roundLabel) => (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {list.map(t => {
        const logoPath = `/logos/${t.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/\./g, "")
          .replace(/'/g, "")}.png`;

        const pickNum = roundLabel === "First Round" ? t.actual : t.secondrd;

        return (
          <li
            key={t.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "flex-start",
            }}
          >
            <div style={{ width: "28px", textAlign: "right" }}>{pickNum}.</div>
            <img
              src={logoPath}
              alt={`${t.name} logo`}
              style={{ width: "30px", height: "30px", objectFit: "contain" }}
            />
            <div>{t.name} ({t.wins}-{t.losses})</div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="app-container">
      <h1 style={{ textAlign: "center" }}>Final Draft Order</h1>
      <p className="subtitle" style={{ textAlign: "center" }}>
        1st and 2nd round picks for all 30 teams.
      </p>

      <div className="grids-container">
        <div className="conference-grid">
          <h2>First Round (1-30)</h2>
          {renderPickList(firstRound, "First Round")}
        </div>
        <div className="conference-grid">
          <h2>Second Round (31-60)</h2>
          {renderPickList(secondRound, "Second Round")}
        </div>
      </div>

      <div className="button-row">
        <button onClick={goBack} style={{ backgroundColor: "#9f5d5dff" }}>
          ↺ Restart
        </button>
        <button onClick={exportPicks} style={{ backgroundColor: "#2c7be5" }}>
          ⇧ Export
        </button>
      </div>
    </div>
  );
}
