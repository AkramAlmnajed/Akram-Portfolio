import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "./lenisStore";

// Weighted, inertial page scroll (premium glide). Fully disabled under
// prefers-reduced-motion — native scroll then handles everything.
//
// IDLE-STOP: Lenis's rAF used to run forever (60×/s even at rest). Now the loop
// only runs for a short window after any scroll-triggering input (wheel, touch,
// key, or a programmatic scrollTo), which comfortably covers Lenis's ~1s glide,
// then cancels itself. A still page = zero scroll frames. Wake-on-input is
// time-based (not tied to Lenis internals) so the smooth-scroll feel is
// untouched — the loop always runs through the entire animation.
const SmoothScroll = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.05, // gentle inertia — premium, not sluggish
      smoothWheel: true,
      // touch left native to avoid fighting the trackpad / mobile gestures
    });
    setLenis(lenis);

    let raf = 0;
    let stopAt = 0;
    const RUN_MS = 1600; // > Lenis duration (1.05s) + buffer, so glides finish

    const loop = (time) => {
      lenis.raf(time);
      if (time < stopAt) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0; // settled → stop the loop
      }
    };
    const start = () => {
      stopAt = performance.now() + RUN_MS;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // Mobile browser chrome (address bar / toolbar) and the soft keyboard fire
    // `resize` with the SAME width and only a height change. Re-waking Lenis on
    // every chrome toggle thrashed the scroll loop (and the fixed background) during
    // a normal mobile scroll, so we ignore EVERY height-only resize — only a WIDTH
    // change is a real re-layout (that also covers orientation flips, which swap
    // innerWidth). orientationchange is handled explicitly as a backstop.
    let lastW = window.innerWidth;
    const onResize = () => {
      const w = window.innerWidth;
      if (w === lastW) return; // height-only → chrome / keyboard toggle, not re-layout
      lastW = w;
      start();
    };

    // Wake on anything that could start a scroll. Passive + capture so we never
    // block input and the loop is alive before Lenis processes the delta.
    const wakeOpts = { passive: true, capture: true };
    window.addEventListener("wheel", start, wakeOpts);
    window.addEventListener("touchstart", start, wakeOpts);
    window.addEventListener("touchmove", start, wakeOpts);
    window.addEventListener("keydown", start, { capture: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", start, { passive: true });

    // Programmatic scrolls (nav links, back-to-top, skip link) must wake too.
    const originalScrollTo = lenis.scrollTo.bind(lenis);
    lenis.scrollTo = (...args) => {
      start();
      return originalScrollTo(...args);
    };

    start();

    return () => {
      window.removeEventListener("wheel", start, wakeOpts);
      window.removeEventListener("touchstart", start, wakeOpts);
      window.removeEventListener("touchmove", start, wakeOpts);
      window.removeEventListener("keydown", start, { capture: true });
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", start);
      if (raf) cancelAnimationFrame(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;
