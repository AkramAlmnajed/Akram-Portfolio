import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import useCardHover from "../layouts/useCardHover";

const ResumeCard = ({
  title,
  company,
  period,
  employmentType,
  location,
  highlights,
}) => {
  const reduce = useReducedMotion();
  // Gentler tilt for the wide rows; cursor spotlight via --mx/--my.
  const { ref, handlers, tiltStyle } = useCardHover({ maxTilt: 6, perspective: 1200 });

  return (
    <motion.article
      ref={ref}
      {...handlers}
      style={tiltStyle}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group glassCardHover relative isolate overflow-hidden grid grid-cols-1 lgl:grid-cols-[1fr_auto] gap-3 lgl:gap-10 py-7 px-5 md:px-8 rounded-control"
    >
      {/* Frosted-glass hover pane + cursor-following gold spotlight. */}
      <span aria-hidden="true" className="cardGlass" />
      <span aria-hidden="true" className="cardSpotlight" />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-titleFont text-h4 md:text-h3 text-accent leading-tight transition-transform duration-base ease-out group-hover:translate-x-1">
            {title}
          </h3>
          <p className="font-bodyFont text-inkMuted transition-transform duration-base ease-out group-hover:translate-x-0.5 group-hover:[transition-delay:50ms]">
            <span className="text-ink font-medium">{company}</span>
            <span className="text-inkMuted"> · {employmentType}</span>
          </p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {highlights.map((line) => (
            <li
              key={line}
              className="flex gap-3 text-inkMuted font-bodyFont leading-relaxed max-w-[68ch]"
            >
              <span
                aria-hidden="true"
                className="mt-[0.7em] h-px w-3 shrink-0 bg-inkSubtle transition-[colors,width] duration-base ease-out group-hover:bg-accent group-hover:w-5"
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative z-10 flex flex-row items-baseline gap-3 lgl:flex-col lgl:items-end lgl:text-right lgl:gap-2 transition-transform duration-base ease-out group-hover:-translate-y-0.5 group-hover:[transition-delay:70ms]">
        <p className="font-monoFont text-mono text-accent whitespace-nowrap">
          {period}
        </p>
        <p className="font-monoFont text-mono uppercase tracking-[0.14em] text-inkMuted">
          {location}
        </p>
      </div>
    </motion.article>
  );
};

export default React.memo(ResumeCard);
