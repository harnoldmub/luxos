import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ReactLenis, useLenis } from "lenis/react";
import type Lenis from "lenis";
import App from "./App";
import "./styles.css";

const reducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Réglages retenus, jamais extrêmes : fluide mais collé à l'input de l'utilisateur.
const lenisOptions = {
  lerp: 0.09,
  smoothWheel: !reducedMotion,
  wheelMultiplier: 1,
  touchMultiplier: 1.6
};

// Expose l'instance Lenis sur window pour les helpers de navigation/motion.
function LenisBridge() {
  const lenis = useLenis();
  useEffect(() => {
    (window as unknown as { lenis?: Lenis }).lenis = lenis ?? undefined;
    return () => {
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, [lenis]);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReactLenis root options={lenisOptions}>
      <LenisBridge />
      <App />
    </ReactLenis>
  </React.StrictMode>
);
