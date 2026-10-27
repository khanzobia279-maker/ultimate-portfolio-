import { useLayoutEffect, useState, useRef } from "react";
import gsap from "gsap";

const palettes = {
  dark:  { "--bg": "#0e100f", "--fg": "#fffce1", "--muted": "#9c9d90", "--card": "#181a19", "--line": "#2a2d2b", "--accent": "#88ce02" },
  light: { "--bg": "#f6f5ee", "--fg": "#0e100f", "--muted": "#5b5d55", "--card": "#ffffff", "--line": "#dcdad0", "--accent": "#4f8a00" }
};

export default function useTheme() {
  const [theme, setTheme] = useState(() => (() => { try { return localStorage.getItem("theme"); } catch { return null; } })() || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  const first = useRef(true);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("theme", theme); } catch { /* storage unavailable */ }
    if (first.current) {           // first paint: no animation, just set the colors
      first.current = false;
      gsap.set(root, palettes[theme]);
      return;
    }
    gsap.to(root, { ...palettes[theme], duration: 0.7, ease: "power2.inOut", overwrite: true });
  }, [theme]);

  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}
