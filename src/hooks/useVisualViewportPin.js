import { useEffect } from "react";

// Pin a position:fixed element to the VISUAL viewport so mobile browser chrome
// (address bar / bottom toolbar) sliding in/out can't drag or snap it. This is the
// one engine-agnostic fix: window.innerHeight / vh / dvh each report the chrome
// transition differently per browser, but window.visualViewport.offsetTop/height
// are consistent on Chrome (Android), Safari (iOS), Firefox, Samsung Internet, and
// the in-app webviews built on them.
//
// We TRANSLATE the (already compositor-promoted) layer by offsetTop as a rigid GPU
// move — we never resize it — so its children (the Damascene mask + the ~18 glyphs,
// all positioned in %) never reflow and therefore never snap. Updates are rAF-
// batched, listeners are passive, and writes go straight to the node's style (ref-
// based, never React state), so there is zero re-render and no layout thrash —
// matching the existing shared-rAF / ScrollProgress pattern.
//
// Feature-detect: if visualViewport is absent (old engines), do nothing — the CSS
// fallback (inset:0 + lvh height + the static translateZ promotion) holds.
export default function useVisualViewportPin(ref) {
  useEffect(() => {
    const el = ref.current;
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (!el || !vv) return undefined;

    let raf = 0;
    const apply = () => {
      raf = 0;
      // Rigid translate only (keeps the translateZ promotion); the children keep
      // their % positions, so nothing inside the layer reflows as the bars slide.
      el.style.transform = `translate3d(0, ${vv.offsetTop}px, 0)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply(); // initial pin
    // 'resize' fires as the chrome animates (height changes); 'scroll' fires as the
    // visual viewport pans relative to the layout viewport (offsetTop changes).
    vv.addEventListener("resize", schedule, { passive: true });
    vv.addEventListener("scroll", schedule, { passive: true });

    return () => {
      vv.removeEventListener("resize", schedule);
      vv.removeEventListener("scroll", schedule);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "translateZ(0)"; // restore the static compositor promotion
    };
  }, [ref]);
}
