import React from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { contactImg } from "../../assets";

const ContactLeft = () => {
  return (
    <div className="w-full h-full rounded-2xl shadow-[0_20px_60px_-35px_rgba(59,130,246,0.65)] border border-white/10 flex flex-col justify-between overflow-hidden relative group bg-gradient-to-b from-[#101a31] to-[#0b1428]">
      <div className="w-full h-[44%] absolute top-0 left-0 z-0 overflow-hidden">
        <img
          className="w-full h-full object-cover object-center filter brightness-75 contrast-110 group-hover:scale-[1.035] transition-transform duration-700"
          src={contactImg}
          alt="Contact"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111b33]/72 to-[#0b1428] z-10" />
        <div className="absolute left-10 right-10 bottom-[2px] h-[0.5px] bg-gradient-to-r from-transparent via-slate-200/45 to-transparent opacity-5 group-hover:opacity-20 transition-opacity duration-500 z-20" />
      </div>

      <div className="flex flex-col gap-6 p-6 lgl:p-8 relative z-20 mt-[36%]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-200/90 font-semibold mb-4">
            Available for Front-End Roles
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Akram Al-Mnajed
          </h3>
          <p className="text-base md:text-lg font-medium text-designColor">
            Front-End Web Developer
          </p>
        </div>
        <p className="text-sm md:text-base text-slate-300 tracking-wide leading-relaxed">
          Front-End engineer focused on production-grade React.js and Next.js
          experiences, API integration, and scalable UI architecture. Open to
          discussing opportunities and meaningful collaborations.
        </p>
        <div className="flex flex-col gap-3 mt-2">
          <p className="text-sm md:text-base text-slate-300 flex flex-col xl:flex-row xl:items-center gap-2">
            <span className="font-semibold text-white">Phone: </span>{" "}
            <span className="text-designColor">+963 957 275 591</span>
          </p>
          <p className="text-sm md:text-base text-slate-300 flex flex-col xl:flex-row xl:items-center gap-2">
            <span className="font-semibold text-white">Email: </span>{" "}
            <span className="text-designColor">akramalmnajed@gmail.com</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 lgl:p-8 relative z-20 pt-0">
        <h2 className="text-[11px] tracking-[0.2em] uppercase font-titleFont mb-1 text-slate-400 font-bold">
          Connect with me
        </h2>
        <div className="flex gap-4">
          <a
            href="https://github.com/AkramAlmnajed"
            target="_blank"
            rel="noopener noreferrer"
            className="bannerIcon w-12 h-12 flex justify-center items-center hover:-translate-y-1 hover:border-designColor transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <FaGithub size={20} className="text-slate-300" />
          </a>
          <a
            href="https://www.linkedin.com/in/akram-almnajed-5a06801a6/"
            target="_blank"
            rel="noopener noreferrer"
            className="bannerIcon w-12 h-12 flex justify-center items-center hover:-translate-y-1 hover:border-designColor transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <FaLinkedinIn size={20} className="text-slate-300" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactLeft;
