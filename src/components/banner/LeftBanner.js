import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaGithub, FaLinkedinIn, FaFileAlt } from "react-icons/fa";
import {
  SiTailwindcss,
  SiNextdotjs,
  SiReact,
  SiTypescript,
} from "react-icons/si";

const titles = [
  "Front-End Web Developer",
  "React / Next.js Developer",
  "Software Engineer",
];

const EASE = [0.16, 1, 0.3, 1];

const LeftBanner = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  const reduce = useReducedMotion();
  const resumePdfUrl =
    "https://drive.google.com/file/d/1OpByZ8IiTcgP_ujJ-3wSxUexp3Z7g5v4/view?usp=sharing";

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 4000); // 4 seconds per word
    return () => clearInterval(interval);
  }, []);

  const handleResumeOpen = () => {
    window.open(resumePdfUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full lgl:w-[56%] flex flex-col gap-10">
      <div className="flex flex-col gap-6 relative">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-3"
        >
          <span aria-hidden="true" className="h-px w-10 bg-accent" />
          <p className="font-monoFont text-mono uppercase tracking-[0.2em] text-inkMuted">
            Front-End Engineering
          </p>
        </motion.div>

        <motion.h1
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-titleFont font-bold text-display text-ink leading-[1.0] tracking-[-0.01em] text-balance"
        >
          Akram Al-Mnajed
        </motion.h1>

        <div className="h-12 md:h-16 relative overflow-hidden flex items-center">
          <AnimatePresence mode="popLayout">
            <motion.p
              key={titles[titleIndex]}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { y: 22, opacity: 0, filter: "blur(6px)" }
              }
              animate={
                reduce
                  ? { opacity: 1 }
                  : { y: 0, opacity: 1, filter: "blur(0px)" }
              }
              exit={
                reduce ? { opacity: 0 } : { y: -20, opacity: 0, filter: "blur(4px)" }
              }
              transition={{ duration: 0.7, ease: EASE }}
              className="absolute font-titleFont italic font-semibold text-3xl md:text-4xl xl:text-5xl text-accent"
            >
              {titles[titleIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="font-bodyFont text-base md:text-bodyLg leading-relaxed text-inkMuted max-w-[60ch]"
        >
          Front-End Web Developer with 3+ years of experience delivering
          production-grade applications in React.js, Next.js, and TypeScript.
          Currently contributing to Thiqa Education on a large online school
          platform while building scalable interfaces and integrating APIs
          across modern backend stacks.
        </motion.p>
      </div>

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
        className="flex flex-col lgl:flex-row lgl:flex-wrap xl:flex-nowrap gap-8 lgl:gap-10 xl:gap-14 justify-start"
      >
        <div>
          <p className="font-monoFont text-mono uppercase tracking-[0.2em] text-inkMuted mb-4">
            Connect
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/AkramAlmnajed"
              target="_blank"
              rel="noopener noreferrer"
              className="bannerIcon"
              aria-label="GitHub profile"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/akram-almnajed-5a06801a6/"
              target="_blank"
              rel="noopener noreferrer"
              className="bannerIcon"
              aria-label="LinkedIn profile"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
        <div>
          <p className="font-monoFont text-mono uppercase tracking-[0.2em] text-inkMuted mb-4">
            Primary Stack
          </p>
          <div className="flex gap-4">
            <div className="bannerIcon cursor-default" title="React">
              <SiReact className="pointer-events-none" />
            </div>
            <div className="bannerIcon cursor-default" title="Next.js">
              <SiNextdotjs className="pointer-events-none" />
            </div>
            <div className="bannerIcon cursor-default" title="TypeScript">
              <SiTypescript className="pointer-events-none" />
            </div>
            <div className="bannerIcon cursor-default" title="Tailwind CSS">
              <SiTailwindcss className="pointer-events-none" />
            </div>
          </div>
        </div>
        <div>
          <p className="font-monoFont text-mono uppercase tracking-[0.2em] text-inkMuted mb-4">
            My Resume
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleResumeOpen}
              aria-label="Open resume PDF"
              className="bannerIcon"
            >
              <FaFileAlt />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeftBanner;
