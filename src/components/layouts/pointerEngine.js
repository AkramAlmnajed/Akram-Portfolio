// Single shared, idle-stopping rAF engine for the whole page.
//
// ONE requestAnimationFrame loop drives every per-frame effect (custom cursor,
// background glow + parallax, portrait orbit, mobile touch glow). Each subscriber
// returns whether it still needs more frames; when they all settle, the loop
// cancels itself — a still pointer / idle page costs ZERO frames. Any subscriber
// can wake() the loop (e.g. a touchstart) and the pointer position is tracked by
// a single passive `pointermove` listener attached only while ≥1 pointer
// subscriber exists. This is the foundation the useRafLoop / usePointer hooks
// build on, and the place all listeners are deduplicated.

const frameSubs = new Set();
let raf = 0;

function tick() {
  raf = 0;
  let busy = false;
  frameSubs.forEach((fn) => {
    if (fn()) busy = true;
  });
  if (busy && frameSubs.size) raf = requestAnimationFrame(tick);
}

export function wake() {
  if (!raf && frameSubs.size) raf = requestAnimationFrame(tick);
}

// Generic per-frame subscriber. fn() -> boolean (true = keep the loop alive).
export function subscribeFrame(fn) {
  frameSubs.add(fn);
  wake();
  return () => {
    frameSubs.delete(fn);
    if (frameSubs.size === 0 && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

// Shared pointer position — one passive listener, reference-counted.
let px = null;
let py = null;
let pointerRefs = 0;

function onMove(e) {
  px = e.clientX;
  py = e.clientY;
  wake();
}

// fn(px, py) -> boolean (true = still animating). Built on subscribeFrame, so it
// shares the single rAF and idle-stops with everything else.
export function subscribePointer(fn) {
  if (px === null && typeof window !== "undefined") {
    px = window.innerWidth / 2;
    py = window.innerHeight / 2;
  }
  if (pointerRefs === 0 && typeof window !== "undefined") {
    window.addEventListener("pointermove", onMove, { passive: true });
  }
  pointerRefs += 1;
  const unsubscribeFrame = subscribeFrame(() => fn(px, py));
  return () => {
    unsubscribeFrame();
    pointerRefs -= 1;
    if (pointerRefs === 0 && typeof window !== "undefined") {
      window.removeEventListener("pointermove", onMove);
    }
  };
}
