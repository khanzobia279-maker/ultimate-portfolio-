import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/** Button/link with a magnetic pull and a GSAP color-fill hover. variant: "solid" | "outline". */
export default function MagneticButton({ as: Tag = "a", variant = "solid", children, className = "", ...props }) {
  const root = useRef(null), fill = useRef(null), label = useRef(null);
  const solid = variant === "solid";
  const { contextSafe } = useGSAP(() => { gsap.set(fill.current, { yPercent: 100 }); }, { scope: root });

  const move = contextSafe((e) => {
    const r = root.current.getBoundingClientRect();
    gsap.to(root.current, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: "power3.out" });
  });
  const enter = contextSafe(() => {
    gsap.to(fill.current, { yPercent: 0, duration: 0.45, ease: "power3.out" });
    gsap.to(label.current, { color: solid ? "var(--bg)" : "#0e100f", duration: 0.3 });
  });
  const leave = contextSafe(() => {
    gsap.to(root.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.4)" });
    gsap.to(fill.current, { yPercent: 100, duration: 0.4, ease: "power3.inOut" });
    gsap.to(label.current, { color: solid ? "#0e100f" : "var(--fg)", duration: 0.3 });
  });

  return (
    <Tag
      ref={root}
      onMouseMove={move}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className={`relative inline-flex overflow-hidden rounded-full px-7 py-3.5 font-medium ${solid ? "bg-accent" : "border border-line"} ${className}`}
      {...props}
    >
      <span ref={fill} className={`absolute inset-0 rounded-full ${solid ? "bg-fg" : "bg-accent"}`} aria-hidden="true" />
      <span ref={label} className="relative" style={{ color: solid ? "#0e100f" : "var(--fg)" }}>{children}</span>
    </Tag>
  );
}
