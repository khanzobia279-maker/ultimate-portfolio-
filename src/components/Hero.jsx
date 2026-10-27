import { useRef } from "react";
import HeroScene from "./HeroScene";
import gsap from "gsap";
import MagneticButton from "./MagneticButton";
import Words from "./Words";
import { profile } from "../data";
import { reduced } from "../lib/motion";
import useCtx from "../lib/useCtx";

function Hero() {
  const root = useRef(null);
  useCtx(() => {
    const chars = gsap.utils.toArray(".h-char");
    gsap.set(chars, { "--w": 600 });
    if (reduced()) return;
    gsap.to(".h-ring", { rotate: 360, duration: 26, ease: "none", repeat: -1 });

    // After the entrance: letters react to the cursor (desktop) or play a slow wave (touch).
    const init = () => {
      gsap.set(".h-name .clip", { overflow: "visible" });
      gsap.set(chars, { "--w": 800 });   // lock each letter's width at its heaviest weight so layout never shifts
      chars.forEach(c => { c.style.width = c.getBoundingClientRect().width + "px"; });
      gsap.set(chars, { "--w": 600 });
      if (matchMedia("(hover: none)").matches) {
        gsap.to(chars, { "--w": 800, y: -10, duration: .5, ease: "sine.inOut", yoyo: true, repeat: 1, stagger: .09 });
        return;
      }
      const move = e => {
        chars.forEach(c => {
          const r = c.getBoundingClientRect();
          const k = Math.max(0, 1 - Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) / 260);
          gsap.to(c, { "--w": 600 + 200 * k, y: -18 * k, duration: .5, ease: "power3.out", overwrite: "auto" });
        });
        const px = e.clientX / innerWidth - .5, py = e.clientY / innerHeight - .5;
        gsap.to(".h-blob-b", { x: px * 90, y: py * 90, duration: 1, overwrite: "auto" });
      };
      const leave = () => gsap.to(chars, { "--w": 600, y: 0, duration: .8, ease: "power3.out", overwrite: "auto" });
      root.current.addEventListener("mousemove", move);
      root.current.addEventListener("mouseleave", leave);
    };

    gsap.timeline({ delay: 3.7, defaults: { ease: "power4.out" } })
      .from(".h-char", { yPercent: 110, rotateX: -90, transformPerspective: 700, transformOrigin: "50% 100%", duration: 1.1, stagger: { each: .06, from: "center" } })
      .from(".h-blob", { scale: .5, opacity: 0, duration: 1.5, stagger: .15 }, 0)
      .from(".h-badge", { scale: 0, rotate: -120, duration: 1.2, ease: "back.out(1.6)" }, "-=1")
      .from(".h-fade", { y: 30, opacity: 0, duration: .8, stagger: .12 }, "-=0.8")
      .call(init);

    const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
    gsap.to(".h-blob-b", { yPercent: -80, xPercent: -40, scrollTrigger: st });
    gsap.to(".h-content", { yPercent: -12, opacity: .3, scrollTrigger: st });
  }, root);

  return (
    <section ref={root} className="relative flex min-h-screen items-end overflow-hidden px-6 pb-20 pt-32 md:px-12">
      <div className="absolute inset-0" aria-hidden="true" style={{ backgroundImage: "radial-gradient(var(--line) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px", WebkitMaskImage: "linear-gradient(to bottom, #000 25%, transparent 95%)", maskImage: "linear-gradient(to bottom, #000 25%, transparent 95%)" }} />
      <HeroScene />
      <div className="h-blob h-blob-b absolute right-[20vw] top-[42vh] aspect-square w-[16vw] max-w-[160px] rounded-full bg-accent" aria-hidden="true" />
      <div className="h-blob absolute left-[8vw] top-[24vh] aspect-square w-[12vw] max-w-[130px] rounded-full border-2" style={{ borderColor: "var(--muted)" }} aria-hidden="true" />
      <div className="h-badge absolute bottom-24 right-6 hidden w-[130px] sm:block md:right-12 md:w-[160px]" aria-hidden="true">
        <svg className="h-ring" viewBox="0 0 200 200">
          <defs><path id="ring" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
          <text fontSize="15" fontWeight="700" fill="currentColor" fontFamily="Bricolage Grotesque, sans-serif"><textPath href="#ring" textLength="498" lengthAdjust="spacing">Frontend developer · AI enthusiast · Open to work · </textPath></text>
        </svg>
        <span className="absolute inset-0 grid place-items-center text-3xl text-accent">↓</span>
      </div>
      <div className="h-content relative mx-auto w-full max-w-7xl">
        <p className="h-fade mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-bg px-4 py-1.5 text-sm text-muted"><span className="h-2 w-2 rounded-full bg-accent" /> {profile.status}</p>
        <h1 className="h-name font-display text-[clamp(3.8rem,14vw,12rem)] font-extrabold leading-[.88] tracking-tight"><Words text={profile.name} cls="h-char" gap=".2em" /></h1>
        <p className="h-fade mt-8 font-display text-xl font-bold md:text-3xl">{profile.role}</p>
        <p className="h-fade mt-3 max-w-xl text-lg text-muted">{profile.tagline}</p>
        <div className="h-fade mt-10 flex flex-wrap gap-4">
          <MagneticButton href="#projects">View my work</MagneticButton>
          <MagneticButton variant="outline" href={"mailto:" + profile.email}>Get in touch</MagneticButton>
        </div>
      </div>
    </section>
  );
}

export default Hero;
