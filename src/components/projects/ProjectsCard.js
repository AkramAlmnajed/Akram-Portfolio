import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BsGithub, BsBoxArrowUpRight } from "react-icons/bs";
import useCardHover from "../layouts/useCardHover";

const ProjectsCard = ({ title, des, githubLink, tags, visibility, index }) => {
  const reduce = useReducedMotion();
  const numeral = index != null ? String(index).padStart(2, "0") : "";
  // A github.com URL is source code; anything else is a live site to visit.
  const isRepo = /github\.com/i.test(githubLink || "");
  const destination = isRepo ? "GitHub repository" : "live site";

  // 3D tilt + cursor spotlight (gated to true-mouse devices; off under reduced motion).
  const { ref, handlers, tiltStyle } = useCardHover({ maxTilt: 7, perspective: 1000 });

  return (
    <motion.a
      ref={ref}
      href={githubLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title} — ${visibility} (opens ${destination} in a new tab)`}
      {...handlers}
      style={tiltStyle}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileTap={reduce ? undefined : { scale: 0.992 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: reduce ? 0 : index ? index * 0.04 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group glassCardHover relative isolate grid grid-cols-[auto_1fr_auto] items-start gap-4 md:gap-6 py-6 px-5 md:px-8 rounded-control"
    >
      {/* Frosted-glass blur pane — blurs the pattern behind the card (see .cardGlass). */}
      <span aria-hidden="true" className="cardGlass" />
      {/* Cursor-following gold spotlight — soft, edgeless (see .cardSpotlight). */}
      <span aria-hidden="true" className="cardSpotlight" />

      {/* Content lift: numeral → title → icon shift/brighten in sequence on hover
          (staggered via group-hover transition-delay; snappy, no delay, on leave). */}
      <span className="relative z-10 font-monoFont text-mono text-inkMuted pt-1 transition-[color,transform] duration-base ease-out group-hover:text-accent group-hover:-translate-y-0.5">
        {numeral}
      </span>

      <div className="relative z-10 flex flex-col gap-2">
        <h3 className="font-titleFont text-h4 md:text-h3 text-accent leading-tight w-fit drawUnderline transition-transform duration-base ease-out group-hover:translate-x-0.5 group-hover:[transition-delay:45ms]">
          {title}
        </h3>
        <p className="font-monoFont text-mono uppercase tracking-[0.16em] text-inkMuted">
          {visibility}
        </p>
        <p className="font-bodyFont text-inkMuted leading-relaxed max-w-[62ch]">
          {des}
        </p>
        {tags && (
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-monoFont text-mono text-inkMuted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <span
        aria-hidden="true"
        className="relative z-10 text-inkMuted pt-1 opacity-60 transition-[opacity,transform,color] duration-base ease-out group-hover:opacity-100 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:rotate-[12deg] group-hover:[transition-delay:85ms]"
      >
        {isRepo ? <BsGithub size={18} /> : <BsBoxArrowUpRight size={17} />}
      </span>
    </motion.a>
  );
};

// Memoized: props come from stable module-level data, so cards never re-render
// after mount (verified: scroll/hover trigger zero re-renders here).
export default React.memo(ProjectsCard);
