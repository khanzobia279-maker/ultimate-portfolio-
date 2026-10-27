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

const GREETINGS = [
  { text: "السلام علیکم", lang: "ur", dir: "rtl", font: '"Noto Naskh Arabic", "Segoe UI", serif' },
  { text: "Hello", lang: "en", dir: "ltr", font: '"Bricolage Grotesque", system-ui, sans-serif' },
  { text: "Bonjour", lang: "fr", dir: "ltr", font: '"Bricolage Grotesque", system-ui, sans-serif' },
  { text: "안녕하세요", lang: "ko", dir: "ltr", font: '"Noto Sans KR", "Malgun Gothic", sans-serif' }
];

function Preloader() {
  const root = useRef(null), num = useRef(null), word = useRef(null);
  useCtx(() => {
    if (reduced()) { root.current.style.display = "none"; return; }
    const o = { v: 0 };
    let idx = 0;
    // Each greeting slides up from below, replacing the previous one.
    const show = i => {
      const g = GREETINGS[i], el = word.current;
      el.textContent = g.text; el.lang = g.lang; el.dir = g.dir; el.style.fontFamily = g.font;
      gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: .45, ease: "power3.out" });
    };
    show(0);
    gsap.timeline()
      .to(o, { v: 100, duration: 2.8, ease: "none", onUpdate: () => {
        num.current.textContent = Math.round(o.v);
        const i = Math.min(GREETINGS.length - 1, Math.floor(o.v / (100 / GREETINGS.length)));
        if (i !== idx) { idx = i; show(i); }
      } })
      .to(".pl-in", { yPercent: -110, duration: .5, ease: "power3.in" })
      .to(root.current, { yPercent: -100, duration: .9, ease: "expo.inOut" })
      .set(root.current, { display: "none" });
  }, root);
  return (
    <div ref={root} className="fixed inset-0 z-[70] flex flex-col justify-between bg-accent p-6 md:p-12" style={{ color: "#0e100f" }} aria-hidden="true">
      <span className="clip"><span className="pl-in block font-display text-xl font-bold">Zobia Khan · Portfolio</span></span>
      <div className="flex items-end justify-between gap-6">
        <div className="overflow-hidden" style={{ padding: ".12em 0" }}>
          <span ref={word} lang="ur" dir="rtl" className="pl-in block text-[clamp(3rem,12vw,9rem)] font-extrabold" style={{ lineHeight: 1.2, textAlign: "left", fontFamily: GREETINGS[0].font }}>{GREETINGS[0].text}</span>
        </div>
        <span className="clip"><span className="pl-in block font-display text-[clamp(3rem,12vw,9rem)] font-extrabold leading-none"><span ref={num}>0</span>%</span></span>
      </div>
    </div>
  );
}


export default Preloader;
