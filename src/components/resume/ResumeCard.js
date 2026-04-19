import React from "react";
import { motion } from "framer-motion";

const ResumeCard = ({
  title,
  company,
  period,
  employmentType,
  location,
  highlights,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="w-full group flex cursor-pointer"
    >
      <div className="w-10 h-[2px] bg-slate-700/80 mt-12 relative">
        <span className="absolute w-5 h-5 rounded-full -top-[9px] -left-[11px] flex justify-center items-center bg-[#0e1931] border border-slate-700/80">
          <span className="w-2.5 h-2.5 rounded-full inline-flex duration-500 bg-slate-500 group-hover:bg-designColor group-hover:shadow-[0_0_14px_rgba(59,130,246,0.85)]"></span>
        </span>
      </div>
      <div className="w-full transition-all duration-500 rounded-2xl p-6 lgl:px-9 flex flex-col justify-center gap-5 border relative overflow-hidden bg-gradient-to-b from-[#101a31] to-[#0b1428] border-white/10 hover:shadow-[0_24px_75px_-45px_rgba(59,130,246,0.9)] hover:border-blue-400/35">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex flex-col lgl:flex-row justify-between gap-4 lgl:gap-6 lgl:items-center relative z-10">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-100 group-hover:text-blue-200 transition-colors duration-500">
              {title}
            </h3>
            <p className="text-sm md:text-base mt-2 text-designColor transition-colors duration-500 font-semibold">
              {company}
            </p>
            <p className="text-sm mt-1 text-slate-400 group-hover:text-slate-300 transition-colors duration-500 font-medium">
              {employmentType}
            </p>
          </div>
          <div className="flex flex-col items-start lgl:items-end gap-2">
            <p className="px-4 py-1.5 text-blue-200 bg-blue-500/10 rounded-lg text-xs md:text-sm font-semibold border border-blue-400/30">
              {period}
            </p>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400 font-semibold">
              {location}
            </p>
          </div>
        </div>
        <ul className="relative z-10 flex flex-col gap-2.5">
          {highlights.map((line) => (
            <li
              key={line}
              className="text-sm md:text-base text-slate-300/95 leading-relaxed flex gap-3"
            >
              <span className="w-1.5 h-1.5 mt-2.5 rounded-full bg-blue-300/80 shrink-0"></span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ResumeCard;
