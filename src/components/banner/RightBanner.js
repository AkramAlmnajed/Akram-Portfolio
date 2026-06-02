import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiJavascript,
  SiGit,
} from "react-icons/si";
import { profilePhoto } from "../../assets/index";
import usePointer from "../../hooks/usePointer";
import useInView from "../../hooks/useInView";
import { useFinePointer } from "../../hooks/useMediaQuery";

// Framework logos orbiting the portrait — bare glyphs, no frame. `style` pins
// each to a point on the ring at 60° spacing (static, so they stay evenly
// distributed even when motion is frozen). The ring spins continuously, each
// logo counter-spins to stay upright, and each bobs on its own float clock.
const ORBIT = [
  { Icon: SiReact, label: "React", style: { top: "0%", left: "50%" }, dur: "6s", d: "0s" },
  { Icon: SiNextdotjs, label: "Next.js", style: { top: "25%", left: "93.3%" }, dur: "7.5s", d: ".5s" },
  { Icon: SiTypescript, label: "TypeScript", style: { top: "75%", left: "93.3%" }, dur: "6.8s", d: "1s" },
  { Icon: SiTailwindcss, label: "Tailwind CSS", style: { top: "100%", left: "50%" }, dur: "8s", d: ".3s" },
  { Icon: SiJavascript, label: "JavaScript", style: { top: "75%", left: "6.7%" }, dur: "6.4s", d: "1.3s" },
  { Icon: SiGit, label: "Git", style: { top: "25%", left: "6.7%" }, dur: "7.2s", d: ".8s" },
];

const RightBanner = () => {
  const reduce = useReducedMotion();
  const parallaxRef = useRef(null);
  const par = useRef({ px: 0, py: 0 });
  // Pause the cluster's continuous CSS animations (orbit spin, glyph floats,
  // halo pulse) whenever the portrait scrolls out of view — frozen in place, no
  // GPU, resumes identically on re-entry.
  const [clusterRef, inView] = useInView({ rootMargin: "140px" });
  const active = useFinePointer();

  // Cursor parallax on the orbit cluster via the SHARED idle-stopping engine
  // (one page-wide rAF; transform only; off for coarse / reduced).
  usePointer((mx, my) => {
    const el = parallaxRef.current;
    if (!el) return false;
    const p = par.current;
    const tx = (mx / window.innerWidth - 0.5) * 26;
    const ty = (my / window.innerHeight - 0.5) * 26;
    p.px += (tx - p.px) * 0.08;
    p.py += (ty - p.py) * 0.08;
    el.style.transform = `translate3d(${p.px.toFixed(2)}px, ${p.py.toFixed(2)}px, 0)`;
    return Math.abs(tx - p.px) > 0.05 || Math.abs(ty - p.py) > 0.05;
  }, active);

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full lgl:w-[44%] flex justify-center items-center relative"
    >
      {/* Whole portrait cluster drifts on a slow float clock — gentle ambient
          life (transform only; frozen calm under reduced motion / off-screen). */}
      <div
        ref={clusterRef}
        className={`relative group glyph-float${inView ? "" : " anim-paused"}`}
        style={{ "--dur": "10s" }}
      >
        {/* Pulsing gold halo behind the portrait (own blurred layer — we pulse
            its opacity/scale, never an every-frame box-shadow). */}
        <div
          aria-hidden="true"
          className="halo-pulse pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-xl"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,39,0.34) 0%, rgba(201,162,39,0.10) 45%, transparent 70%)",
          }}
        />

        {/* Portrait — circular, thin gold ring + warm gold glow. On hover the
            gap grows and the photo eases in (Ken-Burns under the mask). */}
        <div className="relative w-[270px] h-[270px] md:w-[360px] md:h-[360px] lgl:w-[400px] lgl:h-[400px] rounded-full overflow-hidden bg-surface ring-1 ring-accent ring-offset-[5px] ring-offset-bg shadow-glowPortrait transition-[box-shadow] duration-slow ease-out motion-safe:group-hover:ring-offset-[8px]">
          <img
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
            src={profilePhoto}
            alt="Akram Al-Mnajed"
            width="400"
            height="400"
            decoding="async"
          />
        </div>

        {/* Orbiting framework logos — bare glyphs, no frame. parallax wrapper
            (JS) → spinning ring → counter-spin + float per logo. */}
        <div ref={parallaxRef} className="pointer-events-none absolute inset-0 will-change-transform">
          {/* Static centering wrapper (translate stays put) holds the spinning
              ring (rotate only) — so the spin keyframe never clobbers the
              centering and the logos circle the portrait's true center. On phones
              the ring is tucked tighter to the (smaller) portrait so the logos
              don't hug the screen edges or crowd the text above; md+ unchanged. */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] md:w-[124%] md:h-[124%]">
          <div className="orbit-ring relative w-full h-full">
            {ORBIT.map(({ Icon, label, style, dur, d }) => (
              <span
                key={label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={style}
                title={label}
              >
                <span className="orbit-upright block">
                  <span
                    className="glyph-float block text-accent text-lg md:text-[28px]"
                    style={{
                      "--dur": dur,
                      "--d": d,
                      filter: "drop-shadow(0 2px 10px rgba(201,162,39,0.45))",
                    }}
                  >
                    <Icon />
                  </span>
                </span>
              </span>
            ))}
          </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(RightBanner);
