import { useRef, useState, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile, skills, projects, services, FORM_ENDPOINT } from "../data";
import { reduced, batchReveal } from "../lib/motion";
import useCtx from "../lib/useCtx";
import Words from "./Words";
import MagneticButton from "./MagneticButton";
import SectionLabel from "./SectionLabel";

function BackToTop() {
  const btn = useRef(null), ring = useRef(null);
  useLayoutEffect(() => {
    const C = 2 * Math.PI * 20;
    let shown = false;
    gsap.set(btn.current, { autoAlpha: 0, scale: .6 });
    ring.current.style.strokeDasharray = C;
    ring.current.style.strokeDashoffset = C;
    const ctx = gsap.context(() => {
      // The ring fills as you scroll; the button appears after the first screen.
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: s => {
        ring.current.style.strokeDashoffset = C * (1 - s.progress);
        const show = s.scroll() > 600;
        if (show !== shown) { shown = show; gsap.to(btn.current, { autoAlpha: show ? 1 : 0, scale: show ? 1 : .6, duration: .35, ease: "power3.out", overwrite: "auto" }); }
      } });
    });
    return () => ctx.revert();
  }, []);
  const toTop = () => { const l = window.__lenis; if (l) l.scrollTo(0, { duration: 1.4 }); else window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <button ref={btn} onClick={toTop} aria-label="Back to top" className="fixed bottom-6 right-[88px] z-40 grid h-12 w-12 place-items-center rounded-full bg-card shadow-lg">
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="none" stroke="var(--line)" strokeWidth="3" />
        <circle ref={ring} cx="24" cy="24" r="20" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="relative text-lg" aria-hidden="true">↑</span>
    </button>
  );
}


export default BackToTop;
