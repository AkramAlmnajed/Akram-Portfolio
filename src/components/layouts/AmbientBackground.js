import React, { useRef } from "react";
import {
  SiReact,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiNextdotjs,
  SiGit,
  SiGithub,
  SiTailwindcss,
} from "react-icons/si";
// ES import so the asset URL is rewritten for the /Akram-Portfolio/ base path
// (no bare leading-slash src).
import damasPattern from "../../assets/images/damas.svg";
import usePointer from "../../hooks/usePointer";
import { useFinePointer } from "../../hooks/useMediaQuery";

// Faint, LIVING "heritage-meets-stack" background. Behind all content,
// pointer-events: none.
//   1. The seamless Damascene SVG (damas.svg) tiled across the whole site. It
//      ships as black line-art; we use it as an ALPHA MASK over a bg-accent
//      layer, so it renders in the theme gold token (no hardcoded hex, recolors
//      with the theme) on the graphite page. Tiles via mask-repeat.
//   2. A drifting swarm of field-relevant TECH LOGOS (React, JS, TS, HTML, CSS,
//      Next.js, Git, GitHub, Tailwind only).
//   3. A cursor-reactive gold light that follows the pointer and screen-blends
//      over the pattern, plus a gentle parallax — true-mouse devices only.
// Opacity is one tunable token — --pattern-opacity (index.css :root) — kept low
// so body-text contrast holds. Every animation is transform/opacity only and
// freezes calm under reduced motion.

// Tile preserves the SVG's 1920×1080 (16:9) aspect so the seamless edges meet.
const TILE_W = 760;
const TILE_H = Math.round((TILE_W * 1080) / 1920); // 16:9 → 428

// ── Tech logos (allowed set only), split across two parallax depth layers. ────
const LAYER_A = [
  { Icon: SiReact, x: "8%", y: "16%", s: 46, k: "glyph-spin", dur: "46s", d: "0s" },
  { Icon: SiTypescript, x: "17%", y: "67%", s: 36, k: "glyph-twinkle", dur: "6s", d: "1.1s" },
  { Icon: SiTailwindcss, x: "90%", y: "58%", s: 42, k: "glyph-float", dur: "7s", d: ".2s" },
  { Icon: SiJavascript, x: "46%", y: "9%", s: 32, k: "glyph-twinkle", dur: "5.5s", d: ".9s" },
  { Icon: SiHtml5, x: "29%", y: "39%", s: 36, k: "glyph-twinkle", dur: "6.5s", d: ".4s" },
  { Icon: SiGit, x: "63%", y: "30%", s: 32, k: "glyph-float", dur: "9s", d: "1.4s" },
  { Icon: SiNextdotjs, x: "82%", y: "12%", s: 38, k: "glyph-float", dur: "8s", d: ".6s" },
  { Icon: SiCss3, x: "70%", y: "80%", s: 34, k: "glyph-twinkle", dur: "6.1s", d: "1.3s" },
  { Icon: SiReact, x: "38%", y: "88%", s: 26, k: "glyph-spin", dur: "60s", d: ".3s" },
  { Icon: SiGithub, x: "6%", y: "44%", s: 30, k: "glyph-float", dur: "7.8s", d: "1.8s" },
];

const LAYER_B = [
  { Icon: SiTypescript, x: "54%", y: "48%", s: 26, k: "glyph-float", dur: "6.2s", d: "1.5s" },
  { Icon: SiGithub, x: "94%", y: "26%", s: 28, k: "glyph-twinkle", dur: "6.8s", d: ".7s" },
  { Icon: SiTailwindcss, x: "22%", y: "82%", s: 28, k: "glyph-twinkle", dur: "7.4s", d: ".5s" },
  { Icon: SiNextdotjs, x: "67%", y: "67%", s: 30, k: "glyph-float", dur: "5.7s", d: "1.2s" },
  { Icon: SiJavascript, x: "33%", y: "55%", s: 24, k: "glyph-twinkle", dur: "5.9s", d: "1.1s" },
  { Icon: SiReact, x: "88%", y: "72%", s: 28, k: "glyph-spin", dur: "58s", d: ".8s" },
  { Icon: SiGit, x: "12%", y: "30%", s: 26, k: "glyph-twinkle", dur: "6.4s", d: "1.9s" },
  { Icon: SiHtml5, x: "58%", y: "86%", s: 26, k: "glyph-float", dur: "8.1s", d: ".4s" },
];

const Glyph = React.memo(({ Icon, x, y, s, k, dur, d }) => (
  <span
    className="absolute -translate-x-1/2 -translate-y-1/2"
    style={{ left: x, top: y }}
  >
    <span
      className={`block text-accent ${k}`}
      style={{ fontSize: s, lineHeight: 1, "--dur": dur, "--d": d }}
    >
      <Icon />
    </span>
  </span>
));

const AmbientBackground = () => {
  const fieldRef = useRef(null);
  const glowRef = useRef(null);
  // Eligible only on a true mouse (reactive). Touch / coarse / reduced-motion
  // get a calm STATIC pattern: no glow rendered, no listeners, no rAF.
  const interactive = useFinePointer();
  const parallax = useRef({ px: 0, py: 0, gx: 0, gy: 0, init: false });

  // Parallax (field) + cursor glow via the SHARED idle-stopping pointer engine
  // (one listener, one rAF; a still mouse = zero frames). Transform-only.
  usePointer((mx, my) => {
    const field = fieldRef.current;
    const glow = glowRef.current;
    const p = parallax.current;
    if (!p.init) { p.gx = mx; p.gy = my; p.init = true; }
    const tx = (mx / window.innerWidth - 0.5) * 18;
    const ty = (my / window.innerHeight - 0.5) * 18;
    p.px += (tx - p.px) * 0.06;
    p.py += (ty - p.py) * 0.06;
    if (field) field.style.transform = `translate3d(${p.px.toFixed(2)}px, ${p.py.toFixed(2)}px, 0)`;
    p.gx += (mx - p.gx) * 0.16;
    p.gy += (my - p.gy) * 0.16;
    if (glow) glow.style.transform = `translate3d(${p.gx.toFixed(1)}px, ${p.gy.toFixed(1)}px, 0)`;
    return (
      Math.abs(tx - p.px) > 0.03 || Math.abs(ty - p.py) > 0.03 ||
      Math.abs(mx - p.gx) > 0.4 || Math.abs(my - p.gy) > 0.4
    );
  }, interactive);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
      // Explicit dark bg + color-scheme on the pattern's OWN container so Samsung
      // Internet's aggressive dark-mode re-coloring leaves the faint gold star
      // pattern untouched. var(--bg) (#16161a) matches the <html> fill already
      // painted behind this -z-10 layer, so iOS appearance is unchanged.
      style={{ colorScheme: "dark", backgroundColor: "var(--bg)" }}
    >
      <div
        ref={fieldRef}
        className="absolute inset-0 will-change-transform"
        style={{ opacity: "var(--pattern-opacity)" }}
      >
        {/* Seamless Damascene SVG tiled across the field (slow drift). bg-accent
            paints the theme gold; the SVG masks it to the line-art → gold-on-
            graphite, recolored purely from the token. Oversized so drift never
            reveals an edge; its own low opacity keeps it a whisper. */}
        <div
          className="bg-drift-a absolute bg-accent"
          style={{
            inset: "-8%",
            width: "116%",
            height: "116%",
            WebkitMaskImage: `url(${damasPattern})`,
            maskImage: `url(${damasPattern})`,
            WebkitMaskRepeat: "repeat",
            maskRepeat: "repeat",
            WebkitMaskSize: `${TILE_W}px ${TILE_H}px`,
            maskSize: `${TILE_W}px ${TILE_H}px`,
            opacity: 0.6,
          }}
        />

        {/* Logo swarm — Layer A drifts with the pattern. */}
        <div
          className="bg-drift-a absolute"
          style={{ inset: "-8%", width: "116%", height: "116%" }}
        >
          {LAYER_A.map((m, i) => (
            <Glyph key={`a-${i}`} {...m} />
          ))}
        </div>
        {/* Logo swarm — Layer B drifts the other way for parallax depth. */}
        <div
          className="bg-drift-b absolute"
          style={{ inset: "-8%", width: "116%", height: "116%" }}
        >
          {LAYER_B.map((m, i) => (
            <Glyph key={`b-${i}`} {...m} />
          ))}
        </div>
      </div>

      {/* Cursor-reactive gold light — follows the pointer, screen-blends over the
          pattern to softly illuminate it. Rendered only on true-mouse devices. */}
      {interactive && <div ref={glowRef} className="bg-cursor-glow" />}

      {/* Subtle top vignette to seat the fixed navbar. */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
};

export default React.memo(AmbientBackground);
