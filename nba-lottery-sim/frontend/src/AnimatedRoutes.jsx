import { useLocation, Routes, Route } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { useRef } from "react";
import App from "./App";
import Standings from "./Standings";
import PlayoffSim from "./PlayoffSim";
import LotteryOdds from "./LotteryOdds";
import LotterySim from "./LotterySim";
import SecondRound from "./SecondRound";
import FinalPicks from "./FinalPicks";
import "./PageFade.css";

export default function AnimatedRoutes() {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={location.pathname}
        nodeRef={nodeRef}
        classNames="fade"
        timeout={400}
      >
        <div ref={nodeRef} className="fade-page">
          <Routes location={location}>
            <Route path="/" element={<App />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/playoff-sim" element={<PlayoffSim />} />
            <Route path="/lottery-odds" element={<LotteryOdds />} />
            <Route path="/lottery-sim" element={<LotterySim />} />
            <Route path="/second-round" element={<SecondRound />} />
            <Route path="/final-picks" element={<FinalPicks />} />
          </Routes>
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}
