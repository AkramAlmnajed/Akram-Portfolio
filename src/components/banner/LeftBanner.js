import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const LeftBanner = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  const resumePdfUrl =
    "https://drive.google.com/file/d/1QOX6hhdDhCQu-T73rdr5616WpQkt-7GQ/view?usp=sharing";

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
        <motion.p
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs uppercase tracking-[0.22em] text-designColor font-semibold"
        >
          Front-End Engineering
        </motion.p>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-white leading-[1.08] tracking-tight"
        >
          <span className="text-designColor whitespace-nowrap">
            Akram Al-Mnajed
          </span>
        </motion.h1>

        <div className="h-12 md:h-16 relative overflow-hidden flex items-center">
          <AnimatePresence mode="popLayout">
            <motion.h2
              key={titles[titleIndex]}
              initial={{ y: 22, opacity: 0, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl md:text-3xl xl:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-blue-200 to-slate-300 absolute"
            >
              {titles[titleIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg font-bodyFont leading-relaxed tracking-wide text-slate-300/95 max-w-2xl"
        >
          Front-End Web Developer with 3+ years of experience delivering
          production-grade applications in React.js, Next.js, and TypeScript.
          Currently contributing to Thiqa Education on a large online school
          platform while building scalable interfaces and integrating APIs
          across modern backend stacks.
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lgl:flex-row lgl:flex-wrap xl:flex-nowrap gap-8 lgl:gap-10 xl:gap-14 justify-start"
      >
        <div>
          <h2 className="text-[11px] uppercase font-titleFont mb-4 text-slate-400 font-bold tracking-[0.2em]">
            CONNECT
          </h2>
          <div className="flex gap-4">
            <a
              href="https://github.com/AkramAlmnajed"
              target="_blank"
              rel="noopener noreferrer"
              className="bannerIcon group hover:-translate-y-1 hover:border-designColor transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              <FaGithub className="text-slate-300 group-hover:text-white transition-colors duration-500" />
            </a>
            <a
              href="https://www.linkedin.com/in/akram-almnajed-5a06801a6/"
              target="_blank"
              rel="noopener noreferrer"
              className="bannerIcon group hover:-translate-y-1 hover:border-designColor transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              <FaLinkedinIn className="text-slate-300 group-hover:text-white transition-colors duration-500" />
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-[11px] uppercase font-titleFont mb-4 text-slate-400 font-bold tracking-[0.2em]">
            PRIMARY STACK
          </h2>
          <div className="flex gap-4">
            <div className="bannerIcon cursor-default shadow-lg hover:border-designColor hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-500">
              <SiReact className="text-slate-300 pointer-events-none" />
            </div>
            <div className="bannerIcon cursor-default shadow-lg hover:border-designColor hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-500">
              <SiNextdotjs className="text-slate-300 pointer-events-none" />
            </div>
            <div className="bannerIcon cursor-default shadow-lg hover:border-designColor hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-500">
              <SiTypescript className="text-slate-300 pointer-events-none" />
            </div>
            <div className="bannerIcon cursor-default shadow-lg hover:border-designColor hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-500">
              <SiTailwindcss className="text-slate-300 pointer-events-none" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-[11px] uppercase font-titleFont mb-4 text-slate-400 font-bold tracking-[0.2em]">
            MY RESUME
          </h2>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleResumeOpen}
              aria-label="Open resume PDF"
              className="bannerIcon group hover:-translate-y-1 hover:border-designColor transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              <FaFileAlt className="text-slate-300 group-hover:text-white transition-colors duration-500" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeftBanner;
