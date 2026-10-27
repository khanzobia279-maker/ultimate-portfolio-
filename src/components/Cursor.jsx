import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { reduced } from "../lib/motion";

function Cursor() {
  const dot = useRef(null), label = useRef(null);
  useLayoutEffect(() => {
    const el = dot.current;
    if (reduced() || !matchMedia("(hover: hover) and (pointer: fine)").matches) { el.style.display = "none"; return; }
    let shown = false;
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const x = gsap.quickTo(el, "x", { duration: .45, ease: "power3" }), y = gsap.quickTo(el, "y", { duration: .45, ease: "power3" });
    const move = e => { if (!shown) { shown = true; gsap.to(el, { opacity: 1, duration: .3 }); } x(e.clientX); y(e.clientY); };
    // The blob grows over links and shows a word over project cards.
    const over = e => {
      const t = e.target.closest("[data-cursor], a, button, input, textarea, label");
      const text = t && t.dataset.cursor, size = text ? 92 : t ? 52 : 16;
      label.current.textContent = text || "";
      gsap.to(el, { width: size, height: size, opacity: t && !text ? .3 : 1, duration: .35, ease: "power3.out", overwrite: "auto" });
    };
    const out = () => { shown = false; gsap.to(el, { opacity: 0, duration: .2 }); };
    window.addEventListener("mousemove", move); document.addEventListener("mouseover", over); document.documentElement.addEventListener("mouseleave", out);
    return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); document.documentElement.removeEventListener("mouseleave", out); };
  }, []);
  return <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[60] flex items-center justify-center rounded-full bg-accent" style={{ width: 16, height: 16 }} aria-hidden="true"><span ref={label} className="text-xs font-bold" style={{ color: "#0e100f" }} /></div>;
}

export default Cursor;
