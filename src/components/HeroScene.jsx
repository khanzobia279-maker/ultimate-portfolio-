import { useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reduced } from "../lib/motion";

function HeroScene() {
  const mount = useRef(null);
  useLayoutEffect(() => {
    const el = mount.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { el.style.display = "none"; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
    camera.position.z = 7.2;
    const world = new THREE.Group(); scene.add(world);

    // A 3D "</>" code symbol (the brackets from your resume), built from extruded shapes.
    const extrude = (pts, depth) => {
      const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
      const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: .09, bevelSize: .09, bevelSegments: 5 });
      g.center(); return g;
    };
    const mat = c => new THREE.MeshPhysicalMaterial({ color: c, metalness: .3, roughness: .25, clearcoat: 1, clearcoatRoughness: .15 });
    const chev = [[.9, 1.4], [.45, 1.4], [-.8, 0], [.45, -1.4], [.9, -1.4], [-.35, 0]];
    const left = new THREE.Mesh(extrude(chev, .5), mat(0xe0568a));
    const right = new THREE.Mesh(extrude(chev, .5), mat(0x4fb8a2)); right.scale.x = -1;
    const slash = new THREE.Mesh(extrude([[.2, 1.5], [.62, 1.5], [-.2, -1.5], [-.62, -1.5]], .5), mat(0x88ce02));
    const glyph = new THREE.Group(); glyph.scale.setScalar(.85); glyph.add(left, right, slash); world.add(glyph);

    // Orbit rings with travelling dots, like the rings on your LinkedIn banner.
    const rings = [[2.3, 0xe0568a, 1.3], [2.65, 0x4fb8a2, .6], [3.0, 0x88ce02, 1.9]].map(([r, c, tilt]) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.TorusGeometry(r, .012, 8, 180), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .55 })));
      const dot = new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 16), new THREE.MeshBasicMaterial({ color: c }));
      dot.position.x = r; g.add(dot); g.rotation.x = tilt; world.add(g); return g;
    });

    const N = 220, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { const r = 2.6 + Math.random() * 1.2, a = Math.random() * Math.PI * 2; pos.set([Math.cos(a) * r, (Math.random() - .5) * 2.6, Math.sin(a) * r], i * 3); }
    const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x4fb8a2, size: .04, transparent: true, opacity: .9 }));
    world.add(dust);

    scene.add(new THREE.AmbientLight(0xffffff, .6));
    const l1 = new THREE.PointLight(0x4fb8a2, 1.5, 0); l1.position.set(-4, 3, 4);
    const l2 = new THREE.PointLight(0x88ce02, 1.1, 0); l2.position.set(4, -2, 3);
    const l3 = new THREE.PointLight(0xffffff, .9, 0); l3.position.set(0, 4, 5);
    scene.add(l1, l2, l3);

    const still = reduced();
    const m = { x: 0, y: 0, tx: 0, ty: 0 };                                          // eased mouse position
    const st = { y: 0, s: 1, open: 0, intro: still ? 1 : 0 };                        // values GSAP drives
    let fit = 1;
    const pose = t => {
      const away = 1 - st.intro;
      left.position.x = -1.75 - st.open * 1.3 - away * 9;                            // brackets fly in, then open on scroll
      right.position.x = 1.75 + st.open * 1.3 + away * 9;
      left.position.y = Math.sin(t * 1.1 + 1) * .06; right.position.y = Math.sin(t * 1.1 + 2) * .06;
      slash.position.y = away * 7 + Math.sin(t * 1.2) * .08;
      slash.rotation.z = away * 2.2 + st.open * .5;
      glyph.rotation.y = m.x * 1 + Math.sin(t * .5) * .3;
      glyph.rotation.x = m.y * .8 + Math.sin(t * .4) * .1;
      world.position.y = st.y;
      world.scale.setScalar(fit * st.s * (.6 + .4 * st.intro));
      rings.forEach((g, i) => { g.rotation.z = t * (.25 + i * .12) * (i % 2 ? -1 : 1); });
      dust.rotation.y = t * .06 - m.x * .3;
      l1.position.x = -4 + m.x * 6; l2.position.y = -2 - m.y * 6;
    };
    const render = () => renderer.render(scene, camera);
    const size = () => {
      const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
      fit = Math.min(1, camera.aspect / 1.1);                                        // shrink on narrow screens so nothing is cropped
      pose(0); render();
    };
    size();
    const ro = new ResizeObserver(size); ro.observe(el);

    const onMove = e => { m.tx = e.clientX / window.innerWidth - .5; m.ty = e.clientY / window.innerHeight - .5; };
    let visible = true, raf = 0;
    const t0 = performance.now();
    const draw = now => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      m.x += (m.tx - m.x) * .06; m.y += (m.ty - m.y) * .06;
      pose((now - t0) / 1000); render();
    };

    const ctx = gsap.context(() => {
      if (still) return;
      window.addEventListener("pointermove", onMove);
      raf = requestAnimationFrame(draw);
      // Entrance after the preloader: the brackets slide in and the slash drops between them.
      gsap.to(st, { intro: 1, duration: 2, delay: 3.7, ease: "back.out(1.2)" });
      // Scrolling past the hero pulls the brackets apart and lifts the symbol away.
      gsap.to(st, { open: 1, y: -1.2, s: .75, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: true } });
      ScrollTrigger.create({ trigger: el.parentElement, start: "top bottom", end: "bottom top", onToggle: s => { visible = s.isActive; } });
    });

    return () => {
      cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); ro.disconnect(); ctx.revert();
      scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div ref={mount} className="pointer-events-none absolute right-0 top-[8vh] h-[62vh] w-full md:top-[10vh] md:h-[80vh] md:w-[58vw]" aria-hidden="true" />;
}

export default HeroScene;
