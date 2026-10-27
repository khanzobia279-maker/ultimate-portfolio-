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

function About() {
  const root = useRef(null);
  useCtx(() => {
    batchReveal(".a-reveal", { stagger: .12 });
    batchReveal(".a-skill", { y: 30, scale: .9, stagger: .06, start: "top 92%" });
    if (reduced()) return;
    // The intro sentence lights up word by word as you scroll.
    gsap.set(".a-word", { opacity: .15 });
    gsap.to(".a-word", { opacity: 1, stagger: .1, ease: "none", scrollTrigger: { trigger: ".a-word", start: "top 85%", end: "+=320", scrub: true } });
  }, root);
  const enter = e => gsap.to(e.currentTarget, { y: -6, scale: 1.04, borderColor: "var(--accent)", duration: .3, ease: "power2.out", overwrite: "auto" });
  const leave = e => gsap.to(e.currentTarget, { y: 0, scale: 1, borderColor: "var(--line)", duration: .4, ease: "power2.out", overwrite: "auto" });
  return (
    <section id="about" ref={root} className="border-t border-line px-6 py-28 md:px-12">
      <div className="mx-auto max-w-7xl"><SectionLabel n="01" t="About" /></div>
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <h2 className="a-reveal font-display text-4xl font-bold leading-tight md:text-6xl">I learn by building.</h2>
          <p className="mt-8 max-w-2xl font-display text-2xl font-bold leading-snug md:text-4xl">{profile.bio[0].split(" ").map((w, i) => <span key={i} className="a-word mr-[.25em] inline-block">{w}</span>)}</p>
          {profile.bio.slice(1).map(p => <p key={p} className="a-reveal mt-8 max-w-xl text-lg leading-relaxed text-muted">{p}</p>)}
          <dl className="mt-10 space-y-5">
            {profile.facts.map(([k, v]) => <div key={k} className="a-reveal border-t border-line pt-4"><dt className="font-display font-bold">{k}</dt><dd className="mt-1 text-muted">{v}</dd></div>)}
          </dl>
        </div>
        <div>
          <h3 className="a-reveal mb-6 font-display text-2xl font-bold">Tech stack</h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {skills.map(([n, tag]) => (
              <li key={n} onMouseEnter={enter} onMouseLeave={leave} className="a-skill rounded-2xl border border-line bg-card p-5">
                <span className="font-medium">{n}</span>{tag && <span className="mt-2 block text-xs text-accent">{tag}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}


export default About;
