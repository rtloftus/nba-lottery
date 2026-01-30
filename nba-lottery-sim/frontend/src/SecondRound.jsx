import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNBAStore } from "./store";
import "./index.css";

export default function SecondRoundSim() {
    const navigate = useNavigate();
    const { teams } = useNBAStore();

    const [ordered, setOrdered] = useState([]);
    const [revealed, setRevealed] = useState([]);
    const [started, setStarted] = useState(false);
    const [paused, setPaused] = useState(false);
    const [finished, setFinished] = useState(false);

    const intervalRef = useRef(null);
    const indexRef = useRef(0);

    useEffect(() => {
        if (!teams || Object.keys(teams).length === 0) return;

        const sorted = Object.entries(teams)
            .map(([name, info]) => ({ name, ...info }))
            .filter(t => t.secondrd)
            .sort((a, b) => a.secondrd - b.secondrd);

        setOrdered(sorted);
    }, [teams]);

    const startReveal = () => {
        if (ordered.length === 0) return;

        setStarted(true);
        setPaused(false);
        setFinished(false);
        setRevealed([]);
        indexRef.current = 0;

        intervalRef.current = setInterval(() => {
            setRevealed(prev => {
                if (indexRef.current >= ordered.length) {
                    clearInterval(intervalRef.current);
                    setFinished(true);
                    return prev;
                }
                const next = ordered[indexRef.current];
                indexRef.current += 1;
                return [...prev, next];
            });
        }, 200);
    };

    const togglePause = () => {
        if (!started) return;
        if (paused) {
            setPaused(false);
            intervalRef.current = setInterval(() => {
                setRevealed(prev => {
                    if (indexRef.current >= ordered.length) {
                        clearInterval(intervalRef.current);
                        setFinished(true);
                        return prev;
                    }
                    const next = ordered[indexRef.current];
                    indexRef.current += 1;
                    return [...prev, next];
                });
            }, 200);
        } else {
            setPaused(true);
            clearInterval(intervalRef.current);
        }
    };

    useEffect(() => () => clearInterval(intervalRef.current), []);



    const goBack = () => navigate("/lottery-odds");

    const continueToFinal = () => {
        navigate("/final-picks");
    };

    const renderPick = team => {
        const logoPath = `/logos/${team.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/\./g, "")
            .replace(/'/g, "")}.png`;

        const pickNumber = team.secondrd; // use true pick number (31–60)

        return (
            <div
                key={team.name}
                className="pick-row fade-in"
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ fontWeight: "bold", width: "28px" }}>{pickNumber}</div>
                    <img
                        src={logoPath}
                        alt={`${team.name} logo`}
                        style={{ width: "28px", height: "28px", objectFit: "contain" }}
                    />
                    <div>{team.name}</div>
                    <div style={{ color: "#444", marginLeft: "10px", fontSize: "14px", fontWeight: "normal" }}>
                        ({team.wins}-{team.losses})
                    </div>
                </div>
                {team.tiebroken && <div style={{ fontSize: "16px" }}>⛁</div>}
            </div>
        );
    };

    const leftSide = revealed.slice(0, 15);
    const rightSide = revealed.slice(15, 30);

    return (
        <div className="app-container" style={{ textAlign: "center" }}>
            <h1>Round Two Simulation</h1>
            <p style={{ color: "#aaa" }}>
                {finished ? "All picks revealed." : "Revealing picks 31-60..."}
            </p>

            {!started ? (
                <div className="button-row">
                    <button onClick={startReveal} style={{ backgroundColor: "#2c7be5" }}>
                        ⇓ Begin Reveal
                    </button>
                </div>
            ) : (
                <div className="button-row">
                    {!finished ? (
                        <button onClick={togglePause} style={{ backgroundColor: "#2c7be5" }}>
                            {paused ? "▶ Resume" : "⏸ Pause"}
                        </button>
                    ) : (
                        <>
                            <button onClick={goBack} style={{ backgroundColor: "#9f5d5dff" }}>
                                ↺ Go Back
                            </button>
                            <button onClick={continueToFinal} style={{ backgroundColor: "#5d9f6eff" }}>
                                Continue
                            </button>
                        </>

                    )}
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    marginTop: "20px",
                }}
            >
                <div style={{ flex: 1 }}>{leftSide.map(renderPick)}</div>
                <div style={{ flex: 1 }}>{rightSide.map(renderPick)}</div>
            </div>
        </div>
    );
}
