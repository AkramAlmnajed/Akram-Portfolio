import { useEffect, useState } from "react";

// Reactive matchMedia. Re-renders ONLY when the query result flips (device /
// preference change) — never per-frame. SSR-safe (lazy initial read). Used to
// gate pointer:fine / hover:hover / reduced-motion behaviour everywhere.
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(query).matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange); // older Safari
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

// Convenience: true only on a real mouse with hover and no reduced-motion
// preference — the gate for tilt / parallax / cursor / spotlight.
export function useFinePointer() {
  const fine = useMediaQuery("(pointer: fine)");
  const hover = useMediaQuery("(hover: hover)");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  return fine && hover && !reduce;
}
