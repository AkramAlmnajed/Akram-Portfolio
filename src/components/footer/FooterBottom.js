import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const FooterBottom = () => {
  const reduce = useReducedMotion();

  return (
    <motion.footer
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full border-t border-line py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <p className="font-monoFont text-mono uppercase tracking-[0.18em] text-inkMuted">
        © 2026 Akram Al-Mnajed
      </p>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-6 bg-accent" />
        <p className="font-monoFont text-mono uppercase tracking-[0.18em] text-inkMuted">
          All rights reserved
        </p>
      </div>
    </motion.footer>
  );
};

export default FooterBottom;
