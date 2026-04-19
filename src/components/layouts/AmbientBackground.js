import React from "react";
import { motion } from "framer-motion";

const driftingTransition = {
  duration: 18,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
};

const AmbientBackground = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        animate={{ x: [0, 35, 0], y: [0, -22, 0], opacity: [0.2, 0.32, 0.2] }}
        transition={driftingTransition}
        className="absolute -top-24 -left-16 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.2)_0%,_rgba(59,130,246,0.1)_45%,_transparent_75%)] blur-3xl"
      />

      <motion.div
        animate={{ x: [0, -45, 0], y: [0, 24, 0], opacity: [0.06, 0.14, 0.06] }}
        transition={{ ...driftingTransition, duration: 22 }}
        className="absolute top-[14%] -right-44 w-[860px] h-[860px] rounded-full bg-[radial-gradient(circle,_rgba(14,165,233,0.1)_0%,_rgba(59,130,246,0.05)_46%,_transparent_80%)] blur-[130px]"
      />

      <motion.div
        animate={{ rotate: [0, 360], opacity: [0.14, 0.24, 0.14] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute top-[16%] left-[50%] -translate-x-1/2 w-[780px] h-[780px] rounded-full border border-blue-200/10"
      />

      <motion.div
        animate={{ rotate: [360, 0], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute top-[12%] left-[50%] -translate-x-1/2 w-[980px] h-[980px] rounded-full border border-cyan-200/10"
      />

      <motion.div
        animate={{ opacity: [0.1, 0.22, 0.1], scale: [1, 1.04, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-140px] left-[20%] w-[420px] h-[420px] bg-[conic-gradient(from_220deg,_rgba(59,130,246,0.16),_rgba(15,23,42,0),_rgba(14,165,233,0.12),_rgba(15,23,42,0))] blur-[90px]"
      />
    </div>
  );
};

export default AmbientBackground;
