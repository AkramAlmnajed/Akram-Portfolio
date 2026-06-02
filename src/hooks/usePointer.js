import { useEffect, useRef } from "react";
import { subscribePointer } from "../components/layouts/pointerEngine";

// Subscribe a per-frame callback to the shared pointer engine. The callback is
// held in a ref (advanced-event-handler-refs) so the subscription stays stable
// across renders — only `active` toggling re-subscribes. cb(px, py) -> boolean
// (true = keep the shared rAF alive; false = settled / idle-stop). No-op (and no
// listener) while `active` is false — that's the touch / reduced-motion gate.
export default function usePointer(cb, active = true) {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  });
  useEffect(() => {
    if (!active) return undefined;
    return subscribePointer((px, py) => ref.current(px, py));
  }, [active]);
}
