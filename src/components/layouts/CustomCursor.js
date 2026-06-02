import React, { useEffect, useRef } from "react";
import usePointer from "../../hooks/usePointer";
import { useFinePointer } from "../../hooks/useMediaQuery";

// Interactive targets the ring "locks onto".
const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, .nav-link';

// Lightweight custom cursor — a 32px ring + dot that trails the pointer via the
// SHARED idle-stopping rAF (transform only). Mounts ONLY on a true mouse
// (pointer:fine + hover:hover, not reduced-motion), re-checked reactively, so
// touch / coarse-pointer devices never render it, attach a listener, or get
// `cursor: none`.
const CustomCursor = () => {
  const rootRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, init: false });
  const enabled = useFinePointer();

  // Hover-target listeners + hide native cursor — only while enabled.
  useEffect(() => {
    if (!enabled) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;
    document.documentElement.classList.add("has-custom-cursor");
    pos.current.init = false;
    const onOver = (event) => {
      const t = event.target;
      if (t && t.closest && t.closest(INTERACTIVE)) root.dataset.active = "true";
    };
    const onOut = (event) => {
      const t = event.target;
      if (t && t.closest && t.closest(INTERACTIVE)) root.dataset.active = "false";
    };
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  // Ring follows the pointer through the shared engine; settles → idle-stops.
  usePointer((tx, ty) => {
    const root = rootRef.current;
    if (!root) return false;
    const p = pos.current;
    if (!p.init) { p.x = tx; p.y = ty; p.init = true; }
    p.x += (tx - p.x) * 0.2;
    p.y += (ty - p.y) * 0.2;
    root.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    return Math.abs(tx - p.x) > 0.3 || Math.abs(ty - p.y) > 0.3;
  }, enabled);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="cursor-root" data-active="false" aria-hidden="true">
      <span className="cursor-ring" />
      <span className="cursor-dot" />
    </div>
  );
};

export default CustomCursor;
