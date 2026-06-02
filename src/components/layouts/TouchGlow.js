import React, { useEffect, useRef } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import { subscribeFrame, wake } from "./pointerEngine";

// Mobile touch glow: a soft gold light that appears at the finger and tracks it
// during touch/drag, then fades out on lift. Mounts ONLY on coarse-pointer
// devices (never the desktop ring-cursor on touch). Purely decorative —
// pointer-events:none, passive listeners — so native tap/scroll are untouched.
// Driven by the SHARED idle-stopping rAF (no frames once the finger lifts and
// the glow has faded). Disabled under reduced-motion.
const TouchGlow = () => {
  const coarse = useMediaQuery("(pointer: coarse)");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = coarse && !reduce;
  const glowRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const glow = glowRef.current;
    if (!glow) return undefined;
    // tx/ty: target (finger), x/y: eased current, to/o: target/current opacity.
    const s = { tx: 0, ty: 0, x: 0, y: 0, to: 0, o: 0, down: false };

    const onStart = (e) => {
      const t = e.touches[0];
      if (!t) return;
      s.tx = s.x = t.clientX; // snap to the touch point (appears there, no glide-in)
      s.ty = s.y = t.clientY;
      s.to = 1;
      s.down = true;
      wake();
    };
    const onMove = (e) => {
      const t = e.touches[0];
      if (!t) return;
      s.tx = t.clientX;
      s.ty = t.clientY;
      wake();
    };
    const onEnd = () => {
      s.to = 0;
      s.down = false;
      wake();
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });

    const unsubscribe = subscribeFrame(() => {
      s.x += (s.tx - s.x) * 0.25;
      s.y += (s.ty - s.y) * 0.25;
      s.o += (s.to - s.o) * 0.12;
      glow.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0)`;
      glow.style.opacity = s.o.toFixed(3);
      const moving = Math.abs(s.tx - s.x) > 0.5 || Math.abs(s.ty - s.y) > 0.5;
      const fading = Math.abs(s.to - s.o) > 0.01;
      if (!s.down && !moving && !fading && s.o < 0.01) {
        glow.style.opacity = "0";
        return false; // settled → idle-stop
      }
      return true;
    });

    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
      unsubscribe();
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={glowRef} className="touch-glow" aria-hidden="true" />;
};

export default TouchGlow;
