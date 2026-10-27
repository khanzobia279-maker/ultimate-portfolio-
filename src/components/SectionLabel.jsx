import { useRef } from "react";
import gsap from "gsap";
import { reduced } from "../lib/motion";
import useCtx from "../lib/useCtx";

function SectionLabel({ n, t }) {
  const root = useRef(null);
  useCtx(() => {
    if (reduced()) return;
    const scrollTrigger = { trigger: root.current, start: "top 92%" };
    gsap.from(".sl-line", { scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "power3.out", scrollTrigger });
    gsap.from(".sl-txt", { yPercent: 110, duration: .8, ease: "power3.out", scrollTrigger });
  }, root);
  return (
    <div ref={root} className="mb-10 flex items-center gap-4 text-sm text-muted">
      <span className="clip"><span className="sl-txt block">({n}) {t}</span></span>
      <span className="sl-line h-px flex-1 bg-line" />
    </div>
  );
}

export default SectionLabel;
