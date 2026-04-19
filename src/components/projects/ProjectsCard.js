import React from "react";
import { BsGithub } from "react-icons/bs";

const ProjectsCard = ({ title, des, githubLink, tags, visibility }) => {
  return (
    <article className="w-full p-6 xl:px-7 h-auto xl:py-7 rounded-2xl flex flex-col bg-gradient-to-b from-[#101a31] to-[#0b1428] group transition-all duration-500 border border-white/10 hover:border-blue-400/40 shadow-[0_20px_50px_-35px_rgba(59,130,246,0.6)] hover:-translate-y-1.5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="w-full mt-2 flex flex-col gap-6 relative z-10">
        <div>
          <div className="flex items-start justify-between">
            <div className="pr-3">
              <h3 className="text-xl md:text-2xl font-bold text-slate-100 group-hover:text-blue-100 transition-colors duration-500 leading-snug">
                {title}
              </h3>
              <p className="text-[11px] uppercase tracking-[0.17em] text-designColor font-semibold mt-3">
                {visibility}
              </p>
            </div>
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} source or profile`}
            >
              <span className="text-lg w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 inline-flex justify-center items-center text-slate-300 hover:text-white hover:border-designColor hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-pointer">
                <BsGithub size={18} />
              </span>
            </a>
          </div>
          <p className="text-sm tracking-wide mt-4 text-slate-300/90 group-hover:text-slate-200 transition-colors duration-500 leading-relaxed">
            {des}
          </p>
        </div>

        {tags && (
          <div className="flex flex-wrap gap-2 mt-2 relative z-10">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-3 py-1.5 bg-blue-900/20 text-blue-100 rounded-full border border-blue-400/25 group-hover:bg-designColor/15 transition-colors duration-500 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default ProjectsCard;
