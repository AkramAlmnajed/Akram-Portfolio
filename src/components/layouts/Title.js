import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// Gold register mark that sits between the [0x] numeral and the kicker: a
// hairline that draws in left-to-right and lands on a small Damascene eight-
// point star (tying the heading rail to the background lattice). The star keeps
// a faint twinkle. Shared, so every section divider is identical.
const DividerMark = ({ reduce }) => (
  <motion.span
    aria-hidden="true"
    initial={reduce ? { opacity: 0 } : { opacity: 0, x: -6 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: reduce ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
    className="inline-flex shrink-0"
  >
    <svg width="50" height="14" viewBox="0 0 50 14" fill="none" className="text-accent overflow-visible">
      <motion.line
        x1="0" y1="7" x2="30" y2="7"
        stroke="currentColor" strokeWidth="1.4"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <g className="glyph-twinkle" style={{ "--dur": "4.5s" }} stroke="currentColor" strokeWidth="1" fill="none">
        <polygon points="41,1 49,7 41,13 33,7" />
        <rect x="36.4" y="2.4" width="9.2" height="9.2" />
        <circle cx="41" cy="7" r="1.1" fill="currentColor" stroke="none" />
      </g>
    </svg>
  </motion.span>
);

const Title = ({ title, des, index }) => {
  const reduce = useReducedMotion();
  const numeral = index != null ? String(index).padStart(2, "0") : null;

  // Accent the last word as a refined, snug inline GOLD PLATE (dark text on
  // gold, hugs the word, soft gold glow) — not a flat highlighter slab.
  const words = (des || "").trim().split(/\s+/);
  const lead = words.slice(0, -1).join(" ");
  const last = words[words.length - 1] || "";

  return (
    <div className="flex items-baseline gap-5 lgl:gap-8 font-titleFont mb-12 lgl:mb-16">
      {numeral && (
        <span
          aria-hidden="true"
          className="font-titleFont text-numeral text-inkSubtle leading-none select-none"
        >
          {numeral}
        </span>
      )}
      <div className="flex flex-col gap-7 pb-1">
        <div className="flex items-center gap-3">
          <DividerMark reduce={reduce} />
          <p className="font-monoFont text-mono uppercase tracking-[0.18em] text-accent">
            {title}
          </p>
        </div>
        {/* Section headings are gold ink across every section. The last word
            carries a slightly stronger warm glow for a quiet emphasis (no plate,
            no gradient-fill — solid champagne text, ~8:1 on the bg). */}
        <motion.h2
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
          className="font-semibold text-4xl md:text-5xl lgl:text-6xl text-accent leading-[1.08] [text-shadow:0_0_42px_rgba(201,162,39,0.16)]"
        >
          {lead && <span>{lead} </span>}
          <span className="[text-shadow:0_0_34px_rgba(201,162,39,0.34)]">{last}</span>
        </motion.h2>
      </div>
    </div>
  );
};

export default Title;
