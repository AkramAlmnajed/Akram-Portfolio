import React, { useEffect, useRef } from "react";
import { getLenis } from "./lenisStore";
import { subscribeFrame, wake } from "./pointerEngine";
import useMediaQuery from "../../hooks/useMediaQuery";

// Fixed circular scroll meter, bottom-right. Ref-based: ZERO React renders, no
// framer-motion useScroll/useSpring (whose per-scroll measure() was the top JS
// cost on the scroll path). One passive `scroll` listener updates a cached
// target; the SHARED idle-stopping rAF eases the ring + counter toward it and
// cancels itself once settled. scrollHeight/innerHeight are cached and only
// re-measured on resize, so there are no per-frame layout reads.
//
// The ring fill keeps its exact feel by hand-integrating the SAME spring the
// old useSpring used (stiffness 120, damping 26, mass 0.4) via semi-implicit
// Euler with a capped dt — same solver family, frame-rate independent. The
// reveal (opacity + scale, 0→4% scroll) tracks raw progress linearly, matching
// the old useTransform. Under reduced motion: snaps instantly, no scale flourish.
const STIFFNESS = 120;
const DAMPING = 26;
const MASS = 0.4;
const REVEAL_END = 0.04;

const ScrollProgress = () => {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wrapRef = useRef(null);
  const ringRef = useRef(null);
  const pctRef = useRef(null);

  useEffect(() => {
    const s = { fill: 0, vel: 0, target: 0, max: 1, last: 0, init: false, off: -1, pct: -1, rev: -1 };

    const measure = () => {
      s.max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const readTarget = () => {
      s.target = Math.min(1, Math.max(0, window.scrollY / s.max));
    };
    const onScroll = () => { readTarget(); wake(); };
    const onResize = () => { measure(); onScroll(); };

    measure();
    readTarget();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    const unsubscribe = subscribeFrame(() => {
      if (!s.init) { s.fill = s.target; s.init = true; }

      if (reduce) {
        s.fill = s.target;
        s.vel = 0;
      } else {
        const now = performance.now();
        let dt = s.last ? (now - s.last) / 1000 : 1 / 60;
        s.last = now;
        if (dt > 0.032) dt = 0.032; // cap (post-idle / throttled) → stays stable
        // semi-implicit Euler spring toward target (matches the old useSpring)
        const accel = (-STIFFNESS * (s.fill - s.target) - DAMPING * s.vel) / MASS;
        s.vel += accel * dt;
        s.fill += s.vel * dt;
      }

      const settled = Math.abs(s.target - s.fill) < 0.0004 && Math.abs(s.vel) < 0.0008;
      if (settled) { s.fill = s.target; s.vel = 0; s.last = 0; }

      // Write to the DOM ONLY when the rendered value actually changes (no
      // redundant per-frame style invalidation).
      // ring: pathLength normalised to 1 → dashoffset 1-fill (empty→full)
      const off = Math.round((1 - s.fill) * 1000) / 1000;
      if (off !== s.off && ringRef.current) { ringRef.current.style.strokeDashoffset = String(off); s.off = off; }
      // % from the eased fill (in sync with the ring), clamped — write on int change
      const pct = Math.max(0, Math.min(100, Math.round(s.fill * 100)));
      if (pct !== s.pct && pctRef.current) { pctRef.current.textContent = `${pct}%`; s.pct = pct; }
      // reveal from RAW target, linear (matches the old useTransform) — settles at r=1
      const r = Math.round(Math.min(1, s.target / REVEAL_END) * 1000) / 1000;
      if (r !== s.rev && wrapRef.current) {
        wrapRef.current.style.opacity = String(r);
        wrapRef.current.style.transform = reduce ? "scale(1)" : `scale(${(0.82 + 0.18 * r).toFixed(4)})`;
        s.rev = r;
      }

      return !settled; // keep the shared loop alive only while easing
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      unsubscribe();
    };
  }, [reduce]);

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { offset: 0 });
    } else {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  };

  return (
    <div ref={wrapRef} className="fixed bottom-5 right-5 z-40" style={{ opacity: 0 }}>
      <button
        type="button"
        onClick={toTop}
        aria-label="Scroll progress — click to go back to top"
        title="Back to top"
        className="group relative grid h-14 w-14 place-items-center rounded-full border border-line bg-bg/55 backdrop-blur-md shadow-contact transition-[box-shadow,transform] duration-base ease-out hover:shadow-glow active:scale-95"
      >
        <svg
          viewBox="0 0 56 56"
          className="absolute inset-0 h-full w-full -rotate-90"
          fill="none"
          aria-hidden="true"
        >
          {/* Track */}
          <circle cx="28" cy="28" r="23" stroke="rgba(201,162,39,0.16)" strokeWidth="2.5" />
          {/* Progress fill — pathLength normalised to 1; rAF drives dashoffset */}
          <circle
            ref={ringRef}
            cx="28"
            cy="28"
            r="23"
            stroke="#C9A227"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset="1"
          />
        </svg>
        {/* Live percentage (mono). Cross-fades to ↑ on hover. */}
        <span
          ref={pctRef}
          className="relative font-monoFont text-accent text-[11px] leading-none tracking-tight transition-opacity duration-base ease-out group-hover:opacity-0"
        >
          0%
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center text-accent text-base leading-none opacity-0 translate-y-0.5 transition-[opacity,transform] duration-base ease-out group-hover:opacity-100 group-hover:translate-y-0"
        >
          ↑
        </span>
      </button>
    </div>
  );
};

export default ScrollProgress;
