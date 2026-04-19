import React from "react";
import { motion } from "framer-motion";
import Title from "../layouts/Title";
import { FaCertificate, FaGraduationCap, FaLanguage } from "react-icons/fa";

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

const Credentials = () => {
  return (
    <section className="w-full py-24 sectionDivider relative">
      <div className="flex justify-center items-center text-center relative z-10">
        <Title title="LEARNING & CREDENTIALS" des="Education And Growth" />
      </div>
      <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 mt-10 relative z-10">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="glassCard p-7 md:p-8 group xl:h-[390px]"
        >
          <div className="w-12 h-12 rounded-xl border border-blue-300/30 bg-blue-500/10 flex items-center justify-center text-blue-200 text-xl mb-6">
            <FaGraduationCap />
          </div>
          <h3 className="text-2xl font-bold text-slate-100">
            Damascus University
          </h3>
          <p className="text-sm mt-2 text-designColor tracking-[0.13em] uppercase font-semibold">
            Bachelor's Degree, Software Engineering
          </p>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400 mt-3">
            Sep 2019 - Aug 2025
          </p>
          <p className="text-slate-300 mt-5 leading-relaxed text-sm md:text-base">
            Completed software engineering studies with a strong focus on
            practical software architecture, modern web development, and
            maintainable implementation patterns.
          </p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="glassCard p-7 md:p-8 group xl:h-[390px] flex flex-col"
        >
          <div className="w-12 h-12 rounded-xl border border-blue-300/30 bg-blue-500/10 flex items-center justify-center text-blue-200 text-xl mb-6">
            <FaCertificate />
          </div>
          <h3 className="text-2xl font-bold text-slate-100">
            Courses & Credentials
          </h3>
          <p className="text-sm mt-2 text-designColor tracking-[0.13em] uppercase font-semibold">
            Professional Learning
          </p>
          <div className="mt-4 flex flex-col gap-3 overflow-y-auto premium-scroll pr-1 scroll-smooth xl:flex-1 xl:min-h-0">
            {learningItems.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-white/10 bg-[#0f172d] p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-slate-100 font-semibold text-sm md:text-[15px] leading-snug">
                    {item.title}
                  </h4>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-400/25 text-blue-200 font-semibold tracking-wide">
                    {item.year}
                  </span>
                </div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-designColor mt-1.5 font-semibold">
                  {item.provider}
                </p>
                <p className="text-slate-300 mt-1.5 leading-relaxed text-xs md:text-[13px]">
                  {item.summary}
                </p>
              </article>
            ))}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="glassCard p-7 md:p-8 group xl:h-[390px]"
        >
          <div className="w-12 h-12 rounded-xl border border-blue-300/30 bg-blue-500/10 flex items-center justify-center text-blue-200 text-xl mb-6">
            <FaLanguage />
          </div>
          <h3 className="text-2xl font-bold text-slate-100">Languages</h3>
          <p className="text-sm mt-2 text-designColor tracking-[0.13em] uppercase font-semibold">
            Communication
          </p>
          <ul className="text-slate-300 mt-5 space-y-3 text-sm md:text-base">
            <li className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <span>Arabic</span>
              <span className="text-blue-200 text-sm">Native</span>
            </li>
            <li className="flex items-center justify-between">
              <span>English</span>
              <span className="text-blue-200 text-sm">
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
