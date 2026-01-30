import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AnimatedRoutes from "./AnimatedRoutes";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AnimatedRoutes />
  </BrowserRouter>
);
