import React from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

const ContactLeft = () => {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-5 bg-accent" />
          <p className="font-monoFont text-mono uppercase tracking-[0.18em] text-inkMuted">
            Available for Front-End Roles
          </p>
        </div>
        <h3 className="font-titleFont text-h3 md:text-h2 text-ink leading-[1.06]">
          Akram Al-Mnajed
        </h3>
        <p className="font-monoFont text-mono uppercase tracking-[0.16em] text-inkMuted">
          Front-End Web Developer
        </p>
      </div>

      <p className="font-bodyFont text-inkMuted leading-relaxed max-w-[48ch]">
        Front-End engineer focused on production-grade React.js and Next.js
        experiences, API integration, and scalable UI architecture. Open to
        discussing opportunities and meaningful collaborations.
      </p>

      <div className="flex flex-col border-t border-line">
        <div className="flex items-baseline justify-between gap-4 border-b border-line py-3">
          <span className="font-monoFont text-mono uppercase tracking-[0.16em] text-inkMuted">
            Phone
          </span>
          <a
            href="tel:+963957275591"
            className="group font-bodyFont text-ink hover:text-accent transition-colors duration-base ease-out"
          >
            <span className="drawUnderline">+963 957 275 591</span>
          </a>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-line py-3">
          <span className="font-monoFont text-mono uppercase tracking-[0.16em] text-inkMuted">
            Email
          </span>
          <a
            href="mailto:akramalmnajed@gmail.com"
            className="group font-bodyFont text-ink hover:text-accent transition-colors duration-base ease-out break-all"
          >
            <span className="drawUnderline">akramalmnajed@gmail.com</span>
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-monoFont text-mono uppercase tracking-[0.18em] text-inkMuted">
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
            <FaGithub size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/akram-almnajed-5a06801a6/"
            target="_blank"
            rel="noopener noreferrer"
            className="bannerIcon"
            aria-label="LinkedIn profile"
          >
            <FaLinkedinIn size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactLeft;
