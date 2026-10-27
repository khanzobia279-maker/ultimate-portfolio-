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

function ProjectCard({ p, onOpen }) {
  const root = useRef(null);
  const q = s => gsap.utils.selector(root.current)(s);
  useLayoutEffect(() => { gsap.set(q(".p-overlay"), { yPercent: 101 }); }, []);
  const enter = () => { gsap.to(q(".p-img"), { scale: 1.12, duration: .8, ease: "power3.out" }); gsap.to(q(".p-overlay"), { yPercent: 0, duration: .5, ease: "power3.out" }); gsap.to(q(".p-arrow"), { rotate: 45, x: 4, duration: .4, ease: "back.out(2)" }); };
  const leave = () => { gsap.to(q(".p-img"), { scale: 1, duration: .8, ease: "power3.out" }); gsap.to(q(".p-overlay"), { yPercent: 101, duration: .45, ease: "power3.inOut" }); gsap.to(q(".p-arrow"), { rotate: 0, x: 0, duration: .4 }); gsap.to(root.current, { rotateX: 0, rotateY: 0, duration: .6, ease: "power3.out" }); };
  const tilt = e => { const r = root.current.getBoundingClientRect(); gsap.to(root.current, { rotateY: ((e.clientX - r.left) / r.width - .5) * 10, rotateX: -((e.clientY - r.top) / r.height - .5) * 10, transformPerspective: 900, duration: .5, ease: "power2.out" }); };
  const Tag = p.external ? "a" : "button";
  const props = p.external ? { href: p.url, target: "_blank", rel: "noreferrer" } : { type: "button", onClick: () => onOpen(p) };
  return (
    <Tag ref={root} {...props} onMouseEnter={enter} onMouseLeave={leave} onMouseMove={tilt} onFocus={enter} onBlur={leave} data-cursor={p.external ? "Open" : "Preview"}
         className="p-card block w-full overflow-hidden rounded-3xl border border-line bg-card text-left md:w-[440px] md:shrink-0">
      <div className="relative h-64 overflow-hidden">
        <div className="p-img absolute inset-0 grid place-items-center" style={{ background: "linear-gradient(135deg," + p.from + "," + p.to + ")" }}>
          <span className="font-display text-8xl font-extrabold text-white/80">{p.title[0]}</span>
        </div>
        <div className="p-overlay absolute inset-0 flex items-end bg-accent p-6"><span className="font-display text-xl font-bold" style={{ color: "#0e100f" }}>{p.external ? "View on GitHub" : "Preview project"}</span></div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4"><h3 className="font-display text-2xl font-bold">{p.title}</h3><span className="p-arrow text-2xl text-accent" aria-hidden="true">↗</span></div>
        <p className="mt-2 text-muted">{p.desc}</p>
        {p.stack.length > 0 && <ul className="mt-4 flex flex-wrap gap-2" aria-label="Skills used">{p.stack.map(s => <li key={s} className="rounded-full border border-line px-3 py-1 text-xs">{s}</li>)}</ul>}
      </div>
    </Tag>
  );
}

// A stylised page layout in the project's colors, shown until a real "live" URL is added.
function Mock({ p }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "linear-gradient(135deg," + p.from + "," + p.to + ")" }}>
      <div className="flex items-center justify-between px-[6%] py-[4%]">
        <span className="h-3 w-[14%] rounded-full bg-white/80" />
        <span className="flex gap-3">{[0, 1, 2].map(i => <span key={i} className="h-2 w-8 rounded-full bg-white/60" />)}</span>
      </div>
      <div className="flex flex-1 items-center justify-between gap-6 px-[6%]">
        <div className="min-w-0 flex-1">
          <p className="font-display text-3xl font-extrabold leading-tight text-white md:text-5xl">{p.title}</p>
          <span className="mt-4 block h-2 w-3/4 rounded-full bg-white/60" />
          <span className="mt-2 block h-2 w-1/2 rounded-full bg-white/40" />
          <span className="mt-6 inline-block rounded-full bg-white px-6 py-2 text-sm font-medium" style={{ color: "#0e100f" }}>Get started</span>
        </div>
        <div className="hidden aspect-square w-[34%] place-items-center rounded-3xl bg-white/20 sm:grid"><span className="font-display text-8xl font-extrabold text-white/80">{p.title[0]}</span></div>
      </div>
      <div className="grid grid-cols-3 gap-3 px-[6%] py-[4%]">{[0, 1, 2].map(i => <span key={i} className="h-10 rounded-xl bg-white/25" />)}</div>
    </div>
  );
}

function PreviewModal({ p, onClose }) {
  const ov = useRef(null), panel = useRef(null), btn = useRef(null);
  const close = () => {
    if (reduced()) return onClose();
    gsap.to(panel.current, { y: 40, scale: .96, opacity: 0, duration: .25 });
    gsap.to(ov.current, { opacity: 0, duration: .3, onComplete: onClose });
  };
  useLayoutEffect(() => {
    const prev = document.activeElement;
    btn.current.focus({ preventScroll: true });
    const key = e => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", key);
    if (!reduced()) {
      gsap.fromTo(ov.current, { opacity: 0 }, { opacity: 1, duration: .3 });
      gsap.fromTo(panel.current, { y: 70, scale: .92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .55, ease: "back.out(1.4)" });
      gsap.from(ov.current.querySelectorAll(".pv-in"), { y: 20, opacity: 0, stagger: .08, delay: .3, duration: .5, ease: "power3.out" });
    }
    return () => { window.removeEventListener("keydown", key); if (prev && prev.focus) prev.focus({ preventScroll: true }); };
  }, []);
  return (
    <div ref={ov} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,12,35,.7)" }} onClick={close} role="dialog" aria-modal="true" aria-label={p.title + " preview"} data-lenis-prevent>
      <div ref={panel} onClick={e => e.stopPropagation()} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-line bg-bg">
        <div className="flex items-start justify-between gap-4 p-6 pb-4">
          <div><h3 className="font-display text-3xl font-bold">{p.title}</h3><p className="mt-1 text-muted">{p.desc}</p></div>
          <button ref={btn} onClick={close} aria-label="Close preview" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-xl">×</button>
        </div>
        <div className="pv-in mx-6 overflow-hidden rounded-2xl border border-line bg-card">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            {["#ff5f57", "#febc2e", "#28c840"].map(c => <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />)}
            <span className="ml-3 min-w-0 flex-1 truncate rounded-full bg-bg px-4 py-1 text-xs text-muted">{(p.live || p.url).replace(/^https?:\/\//, "")}</span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden">
            {p.live ? <iframe src={p.live} title={p.title + " live preview"} loading="lazy" className="h-full w-full border-0 bg-white" /> : <Mock p={p} />}
          </div>
        </div>
        <div className="p-6">
          {p.stack.length > 0 && <ul className="pv-in mb-6 flex flex-wrap gap-2" aria-label="Skills used">{p.stack.map(s => <li key={s} className="rounded-full border border-line px-3 py-1 text-xs">{s}</li>)}</ul>}
          <div className="pv-in flex flex-wrap gap-3">
            {p.live && <MagneticButton href={p.live} target="_blank" rel="noreferrer">Visit live site</MagneticButton>}
            <MagneticButton variant={p.live ? "outline" : "solid"} href={p.url} target="_blank" rel="noreferrer">View source code</MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const root = useRef(null), track = useRef(null);
  const [open, setOpen] = useState(null);
  useCtx(() => {
    batchReveal(".p-head");
    const mm = gsap.matchMedia();
    // Desktop: the section pins and the cards slide sideways as you scroll.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current, dist = () => t.scrollWidth - window.innerWidth;
      gsap.timeline({ scrollTrigger: { trigger: root.current, pin: true, scrub: 1, start: "top top", end: () => "+=" + dist(), invalidateOnRefresh: true, anticipatePin: 1 } })
        .to(t, { x: () => -dist(), ease: "none" }, 0)
        .to(".p-bar", { scaleX: 1, ease: "none" }, 0);
      // Cards lean with scroll speed, then settle when scrolling stops.
      ScrollTrigger.create({ trigger: root.current, start: "top top", end: () => "+=" + dist(), onUpdate: s => gsap.to(".p-card", { skewX: gsap.utils.clamp(-6, 6, s.getVelocity() / -400), duration: .4, ease: "power3.out", overwrite: "auto" }) });
      const settle = () => gsap.to(".p-card", { skewX: 0, duration: .6, ease: "power3.out", overwrite: "auto" });
      ScrollTrigger.addEventListener("scrollEnd", settle);
      return () => ScrollTrigger.removeEventListener("scrollEnd", settle);
    });
    // Desktop with reduced motion: no sideways slide, so let the cards wrap instead.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: reduce)", () => { gsap.set(track.current, { width: "auto", flexWrap: "wrap" }); });
    // Mobile: cards stack and reveal one after another.
    mm.add("(max-width: 767px)", () => { batchReveal(".p-card", { y: 60, scale: .95, stagger: .12 }); });
  }, root);
  return (
    <section id="projects" ref={root} className="flex min-h-screen flex-col justify-center overflow-hidden border-t border-line py-24">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <SectionLabel n="03" t="Projects" />
        <h2 className="p-head font-display text-4xl font-bold md:text-6xl">Selected projects</h2>
        <p className="p-head mt-3 text-muted">Click a project to preview it.</p>
        <div className="mt-6 hidden h-[3px] w-full bg-line md:block"><div className="p-bar h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} /></div>
      </div>
      <div ref={track} className="mt-12 flex flex-col gap-6 px-6 md:w-max md:flex-row md:px-12">
        {projects.map(p => <ProjectCard key={p.title} p={p} onOpen={setOpen} />)}
      </div>
      {open && ReactDOM.createPortal(<PreviewModal p={open} onClose={() => setOpen(null)} />, document.body)}
    </section>
  );
}


export default Projects;
