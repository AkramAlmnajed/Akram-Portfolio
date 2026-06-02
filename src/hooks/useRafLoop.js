import { useEffect, useRef } from "react";
import { subscribeFrame } from "../components/layouts/pointerEngine";

// Subscribe a per-frame callback to the single shared idle-stopping rAF (the one
// every effect on the page shares). Callback held in a ref so the subscription
// is stable; cb() -> boolean (true = keep the loop alive). Inactive = no
// subscription. Use wake() from pointerEngine to restart the loop on an event.
export default function useRafLoop(cb, active = true) {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  });
  useEffect(() => {
    if (!active) return undefined;
    return subscribeFrame(() => ref.current());
  }, [active]);
}
