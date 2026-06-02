import { useEffect, useRef, useState } from "react";

// IntersectionObserver wrapper. Returns [ref, inView]. Defaults to inView=true
// so content is never hidden before the observer attaches (no flash, no SSR
// mismatch). Used to pause off-screen continuous animations (freeze + resume
// identically) and to lazy-mount heavy below-the-fold content. Re-renders only
// when visibility flips — never per-frame.
export default function useInView({ rootMargin = "0px", threshold = 0, once = false } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView];
}
