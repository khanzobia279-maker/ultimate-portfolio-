import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { profile } from "../data";
import { reduced } from "../lib/motion";

const links = [["About", "#about"], ["Services", "#services"], ["Projects", "#projects"], ["Contact", "#contact"]];

function NavLink({ href, children }) {
  const line = useRef(null);
  const enter = () => gsap.fromTo(line.current, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.35, ease: "power3.out" });
  const leave = () => gsap.to(line.current, { scaleX: 0, transformOrigin: "right", duration: 0.35, ease: "power3.out" });
  return (
    <a href={href} onMouseEnter={enter} onMouseLeave={leave} className="relative py-1 text-sm">
      {children}
      <span ref={line} className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-accent scale-x-0" />
    </a>
  );
}

export default function Navbar({ theme, onToggle }) {
  const nav = useRef(null), icon = useRef(null);
  useGSAP(() => {
    if (reduced()) return;
    gsap.from(nav.current, { y: -60, opacity: 0, duration: 0.9, ease: "power3.out", delay: 3.9 });
  }, { scope: nav });

  const click = () => {
    if (!reduced()) gsap.fromTo(icon.current, { rotate: -120, scale: 0.4 }, { rotate: 0, scale: 1, duration: 0.6, ease: "back.out(2)" });
    onToggle();
  };

  return (
    <header ref={nav} className="fixed inset-x-0 top-0 z-30 backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--bg) 75%, transparent)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4 md:px-12">
        <a href="#" className="font-display text-lg font-bold"><span className="hidden sm:inline">{profile.name}</span><span className="sm:hidden">ZK</span></a>
        <nav className="flex gap-4 sm:gap-8" aria-label="Main">
          {links.map(([n, h]) => <NavLink key={n} href={h}>{n}</NavLink>)}
        </nav>
        <div className="flex justify-end">
          <button onClick={click} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} className="grid h-10 w-10 place-items-center rounded-full border border-line">
            <svg ref={icon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {theme === "dark"
                ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>
                : <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
