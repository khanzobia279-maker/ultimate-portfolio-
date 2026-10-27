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

const reply = q => {
  const s = q.toLowerCase().trim();
  const has = (...w) => w.some(x => new RegExp("\\b" + x).test(s));
  const list = a => a.length > 1 ? a.slice(0, -1).join(", ") + " and " + a[a.length - 1] : a[0];
  if (/^(hi|hello|hey|salam|assalam)\b/.test(s)) return "Hi! I’m Zobia’s portfolio assistant. Ask me about her skills, projects, services or how to contact her.";
  if (has("open", "available", "hiring", "opportunit", "looking", "job")) return "Yes, she’s open to frontend internships, jobs and freelance work, in Karachi or remote.";
  if (has("experience", "arch", "worked", "history", "internship", "intern")) return "Zobia completed a Web Development internship at Arch Technologies (May–June 2026) and works as a freelance frontend developer on client projects.";
  if (has("learn", "express", "next", "studying")) return "She’s learning Express.js now, with Node.js, MongoDB and API integration next. She has already built with React and Redux Toolkit.";
  if (has("skill", "tech", "stack", "language", "tool")) return "Zobia works with " + list(skills.filter(x => !x[1]).map(x => x[0])) + ". She’s learning Express.js.";
  if (has("project", "built", "portfolio", "demo", "preview")) return "Her projects: " + list(projects.filter(x => !x.external).map(x => x.title)) + ". Click any project card to open a preview.";
  if (has("price", "cost", "rate", "charge", "budget")) return "I don’t have pricing details. Send Zobia a message through the contact form and she’ll get back to you.";
  if (has("service", "freelance", "offer", "client")) return "She offers " + list(services.map(x => x.title.toLowerCase())) + ". Use the contact form to discuss your project.";
  if (has("contact", "email", "reach", "message", "linkedin", "github", "talk")) return "You can email " + profile.email + " or use the contact form at the bottom of this page. She’s also on LinkedIn and GitHub.";
  if (has("education", "study", "college", "smit", "certif", "course", "school")) return "She studies Modern Web & App Development at SMIT and Computer Science at MMC Govt Girls College. Her certificates include Cisco Introduction to Modern AI, Cisco Learn-A-Thon 2026 and Arch Technologies Web Development.";
  if (has("ai", "craft")) return "Zobia is an AI explorer who creates AI crafts and loves experimenting with modern AI tools.";
  if (has("where", "location", "live", "karachi", "pakistan", "based")) return "She’s based in Karachi, Pakistan.";
  if (has("who", "about", "yourself", "zobia")) return "Zobia Khan is a modern frontend developer and AI enthusiast from Karachi. She builds fast, responsive websites with React, Tailwind CSS and GSAP.";
  return "I only know what’s on this page. Try asking about her skills, projects, services, what she’s learning, or how to contact her.";
};

const SUGGESTIONS = ["What are your skills?", "Are you open to work?", "Show me your projects", "How can I contact you?"];

function Assistant() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState([{ from: "bot", text: "Hi! I’m a small assistant that answers from this page. Ask me about Zobia’s work." }]);
  const panel = useRef(null), log = useRef(null), input = useRef(null), launcher = useRef(null);
  const first = useRef(true), seen = useRef(false);

  useLayoutEffect(() => { gsap.set(panel.current, { autoAlpha: 0, y: 30, scale: .92, transformOrigin: "100% 100%" }); }, []);
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    const d = reduced() ? 0 : .45;
    if (open) { gsap.to(panel.current, { autoAlpha: 1, y: 0, scale: 1, duration: d, ease: "back.out(1.5)" }); input.current.focus({ preventScroll: true }); }
    else gsap.to(panel.current, { autoAlpha: 0, y: 30, scale: .92, duration: d * .6 });
  }, [open]);
  useLayoutEffect(() => {
    const box = log.current; box.scrollTop = box.scrollHeight;
    if (!seen.current) { seen.current = true; return; }
    const els = box.querySelectorAll(".msg"), last = els[els.length - 1];
    if (last && !reduced()) gsap.from(last, { y: 14, opacity: 0, duration: .35, ease: "power3.out" });
  }, [msgs, typing]);
  useLayoutEffect(() => {
    if (!open) return;
    const key = e => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);

  const ask = q => {
    q = q.trim();
    if (!q || typing) return;
    setMsgs(m => [...m, { from: "me", text: q }]); setText(""); setTyping(true);
    setTimeout(() => { setMsgs(m => [...m, { from: "bot", text: reply(q) }]); setTyping(false); }, 700);
  };
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <div ref={panel} role="dialog" aria-label="Portfolio assistant" className="flex h-[min(70vh,520px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div><p className="font-display font-bold">Ask about Zobia</p><p className="text-xs text-muted">Portfolio assistant</p></div>
          <button onClick={() => setOpen(false)} aria-label="Close assistant" className="grid h-8 w-8 place-items-center rounded-full border border-line">×</button>
        </div>
        <div ref={log} role="log" aria-live="polite" data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={"msg w-fit max-w-[85%] rounded-2xl px-4 py-2.5 text-sm " + (m.from === "me" ? "ml-auto rounded-br-md bg-accent" : "rounded-bl-md border border-line bg-bg")} style={m.from === "me" ? { color: "#0e100f" } : undefined}>{m.text}</div>
          ))}
          {typing && <div className="msg flex w-fit gap-1.5 rounded-2xl rounded-bl-md border border-line bg-bg px-4 py-3" aria-label="Typing">{[0, 1, 2].map(i => <span key={i} className="h-2 w-2 animate-pulse rounded-full bg-muted" style={{ animationDelay: i * .2 + "s" }} />)}</div>}
        </div>
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {SUGGESTIONS.map(s => <button key={s} onClick={() => ask(s)} className="rounded-full border border-line px-3 py-1.5 text-xs transition-colors hover:border-accent">{s}</button>)}
        </div>
        <form onSubmit={e => { e.preventDefault(); ask(text); }} className="flex gap-2 border-t border-line p-3">
          <input ref={input} value={text} onChange={e => setText(e.target.value)} placeholder="Ask a question…" aria-label="Your question" className="min-w-0 flex-1 rounded-full border border-line bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent" />
          <button type="submit" className="rounded-full bg-accent px-5 text-sm font-medium" style={{ color: "#0e100f" }}>Send</button>
        </form>
      </div>
      <button ref={launcher} onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label={open ? "Close assistant" : "Open assistant"}
              onMouseEnter={() => gsap.to(launcher.current, { scale: 1.1, duration: .3, ease: "power3.out" })} onMouseLeave={() => gsap.to(launcher.current, { scale: 1, duration: .4, ease: "power3.out" })}
              className="grid h-14 w-14 place-items-center rounded-full bg-accent shadow-lg" style={{ color: "#0e100f" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />}
        </svg>
      </button>
    </div>
  );
}


export default Assistant;
