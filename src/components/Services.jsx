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

function ServiceRow({ s, i }) {
  const root = useRef(null);
  const q = x => gsap.utils.selector(root.current)(x);
  const cv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  useLayoutEffect(() => { gsap.set(q(".sv-fill"), { yPercent: 101 }); }, []);
  const enter = () => {
    gsap.to(q(".sv-fill"), { yPercent: 0, duration: .5, ease: "power3.out" });
    gsap.to(q(".sv-ink"), { color: "#0e100f", duration: .3 });
    gsap.to(q(".sv-title"), { x: 16, duration: .4, ease: "power3.out" });
    gsap.to(q(".sv-arrow"), { x: 8, duration: .4, ease: "power3.out" });
  };
  const leave = () => {
    gsap.to(q(".sv-fill"), { yPercent: 101, duration: .45, ease: "power3.inOut" });
    gsap.to(q(".sv-title"), { color: cv("--fg"), x: 0, duration: .4, ease: "power3.out" });
    gsap.to(q(".sv-mute"), { color: cv("--muted"), duration: .3 });
    gsap.to(q(".sv-arrow"), { color: cv("--fg"), x: 0, duration: .4, ease: "power3.out" });
  };
  return (
    <li ref={root} onMouseEnter={enter} onMouseLeave={leave} className="sv-row relative overflow-hidden border-b border-line">
      <span className="sv-fill absolute inset-0 bg-accent" aria-hidden="true" />
      <div className="relative grid items-center gap-4 px-2 py-8 md:grid-cols-[70px_1.2fr_1.5fr_auto] md:gap-8 md:px-4">
        <span className="sv-ink sv-mute font-display text-lg text-muted">0{i + 1}</span>
        <h3 className="sv-ink sv-title font-display text-3xl font-bold md:text-5xl">{s.title}</h3>
        <div>
          <p className="sv-ink sv-mute text-muted">{s.desc}</p>
          <ul className="mt-3 flex flex-wrap gap-2">{s.tags.map(t => <li key={t} className="sv-ink sv-mute rounded-full border border-line px-3 py-1 text-xs text-muted">{t}</li>)}</ul>
        </div>
        <span className="sv-ink sv-arrow hidden text-3xl md:block" aria-hidden="true">→</span>
      </div>
    </li>
  );
}

function Services() {
  const root = useRef(null);
  useCtx(() => { batchReveal(".sv-head"); batchReveal(".sv-row", { y: 40, stagger: .12 }); }, root);
  return (
    <section id="services" ref={root} className="border-t border-line px-6 py-28 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionLabel n="02" t="Services" />
        <h2 className="sv-head font-display text-4xl font-bold md:text-6xl">What I can build for you</h2>
        <p className="sv-head mt-4 max-w-xl text-lg text-muted">Open to freelance projects and frontend internships.</p>
        <ul className="mt-14 border-t border-line">{services.map((s, i) => <ServiceRow key={s.title} s={s} i={i} />)}</ul>
      </div>
    </section>
  );
}


export default Services;
