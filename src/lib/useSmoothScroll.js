import { useLayoutEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reduced } from "./motion";

function useSmoothScroll() {
  useLayoutEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ lerp: .1 }); window.__lenis = lenis;                     // inertia scrolling, kept in sync with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    const tick = t => lenis.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    const onClick = e => {                                     // in-page links glide instead of jumping
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      e.preventDefault(); const id = a.getAttribute("href");
      lenis.scrollTo(id === "#" ? 0 : id, { duration: 1.4 });
    };
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("click", onClick); gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = null; };
  }, []);
}


export default useSmoothScroll;
