import { useCallback, useEffect, useRef } from "react";
import { useSpring } from "framer-motion";
import { useFinePointer } from "../../hooks/useMediaQuery";

// Shared card hover: a gentle spring-driven 3D tilt toward the cursor plus the
// pointer position written to --mx/--my (read by .cardGlass / .cardSpotlight).
// The card rect is cached on pointer-enter, so the per-frame move handler does
// ZERO layout reads (no getBoundingClientRect mid-frame → no forced reflow);
// it only writes (CSS vars + spring targets). The springs are framer motion
// values (no React re-render). Active ONLY on a true mouse — touch / coarse /
// reduced-motion get no listeners and no 3D transform.
const TILT_SPRING = { stiffness: 170, damping: 18, mass: 0.6 };

export default function useCardHover({ maxTilt = 7, perspective = 1000 } = {}) {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const rafRef = useRef(0);
  const lastEvent = useRef(null);
  const active = useFinePointer();

  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);

  const apply = useCallback(() => {
    rafRef.current = 0;
    const event = lastEvent.current;
    const el = ref.current;
    if (!event || !el) return;
    let rect = rectRef.current;
    if (!rect) { rect = el.getBoundingClientRect(); rectRef.current = rect; }
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    el.style.setProperty("--mx", `${px}px`);
    el.style.setProperty("--my", `${py}px`);
    rotateY.set((px / rect.width - 0.5) * 2 * maxTilt);
    rotateX.set(-(py / rect.height - 0.5) * 2 * maxTilt);
  }, [rotateX, rotateY, maxTilt]);

  // Read the rect ONCE per hover session (batched read, never during a write).
  const onMouseEnter = useCallback(() => {
    const el = ref.current;
    if (el) rectRef.current = el.getBoundingClientRect();
  }, []);

  const onMouseMove = useCallback(
    (event) => {
      lastEvent.current = event;
      if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);
    },
    [apply]
  );

  const onMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    rectRef.current = null;
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return {
    ref,
    active,
    handlers: active ? { onMouseEnter, onMouseMove, onMouseLeave } : {},
    tiltStyle: active ? { transformPerspective: perspective, rotateX, rotateY } : undefined,
  };
}
