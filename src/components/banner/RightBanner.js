import React from "react";
import { motion } from "framer-motion";
import { profilePhoto } from "../../assets/index";

const RightBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full lgl:w-[44%] flex justify-center items-center relative"
    >
      <div className="relative">
        <div className="absolute -inset-24 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.12)_0%,_rgba(59,130,246,0.06)_34%,_rgba(15,23,42,0)_72%)] blur-[125px]" />
        <motion.div
          animate={{ opacity: [0.22, 0.38, 0.22], scale: [1, 1.06, 1] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-20 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.2)_0%,_rgba(59,130,246,0.11)_38%,_rgba(14,165,233,0.05)_52%,_rgba(15,23,42,0)_76%)] blur-[105px]"
        />

        <motion.div
          animate={{
            rotate: 360,
            opacity: [0.25, 0.45, 0.25],
            scale: [1, 1.015, 1],
          }}
          transition={{
            rotate: { duration: 36, repeat: Infinity, ease: "linear" },
            opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute inset-0 rounded-full border border-blue-300/30 scale-[1.035]"
        />
        <motion.div
          animate={{
            rotate: -360,
            opacity: [0.2, 0.35, 0.2],
            scale: [1.04, 1.06, 1.04],
          }}
          transition={{
            rotate: { duration: 52, repeat: Infinity, ease: "linear" },
            opacity: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute inset-0 rounded-full border border-slate-500/45"
        />
        <motion.div
          animate={{ rotate: 360, opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 68, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-blue-200/20 scale-[1.1]"
        />

        <div className="w-[290px] h-[290px] md:w-[390px] md:h-[390px] lgl:w-[430px] lgl:h-[430px] rounded-full overflow-hidden shadow-[0_0_120px_rgba(37,99,235,0.18)] ring-1 ring-white/20 border-[8px] border-[#0a1225] relative z-10 flex items-center justify-center bg-slate-900 transition-all duration-700 hover:shadow-[0_0_140px_rgba(37,99,235,0.22)]">
          <div className="absolute inset-2 rounded-full border border-white/10 z-20 pointer-events-none" />
          <img
            className="w-full h-full object-cover object-top filter brightness-105 contrast-105 scale-[1.01]"
            src={profilePhoto}
            alt="Akram Al-Mnajed"
          />
        </div>
      </div>
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[740px] h-[740px] lgl:w-[1080px] lgl:h-[1080px] bg-[radial-gradient(circle,_rgba(59,130,246,0.08)_0%,_rgba(59,130,246,0.05)_28%,_rgba(15,23,42,0)_80%)] blur-[175px] rounded-full z-0 pointer-events-none" />
    </motion.div>
  );
};

export default RightBanner;
