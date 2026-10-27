import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile, skills, projects, FORM_ENDPOINT } from "../data";
import { reduced, batchReveal } from "../lib/motion";
import useCtx from "../lib/useCtx";
import Words from "./Words";
import MagneticButton from "./MagneticButton";

function Marquee() {
  const root = useRef(null);
  useCtx(() => {
    if (reduced()) return;
    const tweens = gsap.utils.toArray(".mq-row").map((r, i) =>
      gsap.fromTo(r, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 30, ease: "none", repeat: -1 }));
    // Bands speed up with scroll velocity, then settle back.
    ScrollTrigger.create({ onUpdate: s => {
      const v = Math.min(Math.abs(s.getVelocity()) / 250, 8);
      tweens.forEach(t => { t.timeScale(1 + v); gsap.to(t, { timeScale: 1, duration: 1, overwrite: true }); });
    } });
  }, root);
  const items = [...skills, ...skills].map(s => s[0]);
  return (
    <section ref={root} className="overflow-hidden border-t border-line py-8" aria-hidden="true">
      {[0, 1].map(k => (
        <div key={k} className="mq-row flex w-max">
          {[0, 1].map(c => (
            <div key={c} className="flex shrink-0">
              {items.map((n, i) => (
                <span key={i} className={"font-display font-extrabold whitespace-nowrap px-6 " + (k ? "text-4xl md:text-6xl" : "text-5xl md:text-8xl")}
                      style={k ? { color: "transparent", WebkitTextStroke: "1.5px var(--fg)" } : { color: i % 2 ? "var(--accent)" : "var(--fg)" }}>
                  {n} <span className="text-accent" style={{ WebkitTextStroke: 0 }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

export default Marquee;
