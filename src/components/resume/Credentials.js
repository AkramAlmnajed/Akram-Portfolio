import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Title from "../layouts/Title";
import { FaCertificate, FaGraduationCap, FaLanguage } from "react-icons/fa";
import useCardHover from "../layouts/useCardHover";

const learningItems = [
  {
    title: "React.js Development",
    provider: "Tarmeez Academy",
    year: "2023",
    summary:
      "Focused on building dynamic component-driven interfaces, reusable architecture patterns, and modern front-end workflows.",
  },
  {
    title: "Flutter Development",
    provider: "Abdullah Mansour's Course",
    year: "2021",
    summary:
      "Covered mobile development fundamentals with state management and practical API integration techniques.",
  },
  {
    title: "Python for Everybody",
    provider: "Coursera",
    year: "2020",
    summary:
      "Built a broad programming foundation from core syntax to structured problem solving and data handling.",
  },
];

// Gold category label: accent icon + accent text + a short gold hairline tick.
// Lifts slightly on card hover (content-lift).
const SectionLabel = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2.5 text-accent transition-transform duration-base ease-out group-hover:translate-x-0.5">
    <Icon aria-hidden="true" />
    <span className="font-monoFont text-mono uppercase tracking-[0.18em]">{children}</span>
    <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
  </div>
);

const Credentials = () => {
  const reduce = useReducedMotion();

  // One tilt/spotlight instance per card (independent refs + springs). Gentle
  // tilt for these panels; off on touch / reduced motion.
  const edu = useCardHover({ maxTilt: 6, perspective: 1100 });
  const courses = useCardHover({ maxTilt: 6, perspective: 1100 });
  const langs = useCardHover({ maxTilt: 6, perspective: 1100 });

  const reveal = (i) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: {
      duration: 0.5,
      delay: reduce ? 0 : i * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  });

  return (
    <section className="w-full py-20 lgl:py-24 sectionDivider relative">
      <div className="relative z-10">
        <Title title="LEARNING & CREDENTIALS" des="Education And Growth" index={2} />
      </div>
      <div className="w-full grid grid-cols-1 lgl:grid-cols-3 gap-y-2 lgl:gap-x-4 mt-8 relative z-10">
        {/* Education */}
        <motion.article
          ref={edu.ref}
          {...reveal(0)}
          {...edu.handlers}
          style={edu.tiltStyle}
          className="group glassCardHover relative isolate overflow-hidden rounded-control flex flex-col gap-4 py-7 lgl:py-8 px-6 lgl:px-9"
        >
          <span aria-hidden="true" className="cardGlass" />
          <span aria-hidden="true" className="cardSpotlight" />
          <SectionLabel icon={FaGraduationCap}>Education</SectionLabel>
          <div className="flex flex-col gap-1 transition-transform duration-base ease-out group-hover:translate-x-0.5 group-hover:[transition-delay:50ms]">
            <h3 className="font-titleFont font-semibold text-h4 text-ink leading-tight">
              Damascus University
            </h3>
            <p className="font-bodyFont text-inkMuted">
              Bachelor's Degree, Software Engineering
            </p>
            <p className="font-monoFont text-mono uppercase tracking-[0.14em] text-accent mt-1">
              Sep 2019 - Aug 2025
            </p>
          </div>
          <p className="font-bodyFont text-inkMuted leading-relaxed">
            Completed software engineering studies with a strong focus on
            practical software architecture, modern web development, and
            maintainable implementation patterns.
          </p>
        </motion.article>

        {/* Courses & Credentials — inner list scrolls (gold scrollbar). */}
        <motion.article
          ref={courses.ref}
          {...reveal(1)}
          {...courses.handlers}
          style={courses.tiltStyle}
          className="group glassCardHover relative isolate overflow-hidden rounded-control flex flex-col gap-4 py-7 lgl:py-8 px-6 lgl:px-9"
        >
          <span aria-hidden="true" className="cardGlass" />
          <span aria-hidden="true" className="cardSpotlight" />
          <SectionLabel icon={FaCertificate}>Courses &amp; Credentials</SectionLabel>
          {/* data-lenis-prevent: stop the weighted page-scroll (Lenis) from
              swallowing the wheel here so this list scrolls natively; overscroll
              contain keeps the scroll from chaining back to the page at the ends. */}
          <div
            data-lenis-prevent
            className="relative z-10 flex flex-col overflow-y-auto overscroll-contain premium-scroll pr-2 max-h-[230px] min-h-0"
          >
            {learningItems.map((item) => (
              <article
                key={item.title}
                className="flex flex-col gap-1 border-t border-accent/15 py-3 first:border-t-0 first:pt-0"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-titleFont font-semibold text-ink leading-snug">
                    {item.title}
                  </h4>
                  <span className="font-monoFont text-mono text-accent whitespace-nowrap">
                    {item.year}
                  </span>
                </div>
                <p className="font-monoFont text-mono uppercase tracking-[0.12em] text-inkMuted">
                  {item.provider}
                </p>
                <p className="font-bodyFont text-inkMuted leading-relaxed text-sm">
                  {item.summary}
                </p>
              </article>
            ))}
          </div>
        </motion.article>

        {/* Languages */}
        <motion.article
          ref={langs.ref}
          {...reveal(2)}
          {...langs.handlers}
          style={langs.tiltStyle}
          className="group glassCardHover relative isolate overflow-hidden rounded-control flex flex-col gap-4 py-7 lgl:py-8 px-6 lgl:px-9"
        >
          <span aria-hidden="true" className="cardGlass" />
          <span aria-hidden="true" className="cardSpotlight" />
          <SectionLabel icon={FaLanguage}>Languages</SectionLabel>
          <ul className="flex flex-col transition-transform duration-base ease-out group-hover:translate-x-0.5 group-hover:[transition-delay:50ms]">
            <li className="flex items-center justify-between border-t border-accent/15 py-3 first:border-t-0">
              <span className="font-bodyFont text-ink">Arabic</span>
              <span className="font-monoFont text-mono uppercase tracking-[0.14em] text-inkMuted">
                Native
              </span>
            </li>
            <li className="flex items-center justify-between border-t border-accent/15 py-3">
              <span className="font-bodyFont text-ink">English</span>
              <span className="font-monoFont text-mono uppercase tracking-[0.14em] text-inkMuted">
                Professional Proficiency
              </span>
            </li>
          </ul>
        </motion.article>
      </div>
    </section>
  );
};

export default Credentials;
