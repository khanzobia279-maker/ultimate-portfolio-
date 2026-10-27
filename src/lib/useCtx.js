import { useLayoutEffect } from "react";
import gsap from "gsap";

/** Runs GSAP setup inside a scoped context and reverts it on unmount. */
export default function useCtx(fn, ref) {
  useLayoutEffect(() => { const c = gsap.context(fn, ref); return () => c.revert(); }, []);
}
