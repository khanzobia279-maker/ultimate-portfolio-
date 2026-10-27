import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Hide targets, then reveal them in staggered batches as they enter the viewport. */
export function batchReveal(selector, { y = 40, scale = 1, stagger = 0.1, start = "top 88%" } = {}) {
  if (reduced()) return;
  gsap.set(selector, { opacity: 0, y, scale });
  ScrollTrigger.batch(selector, {
    start,
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, scale: 1, stagger, duration: 0.9, ease: "power3.out" })
  });
}
