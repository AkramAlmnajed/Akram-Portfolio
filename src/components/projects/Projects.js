import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Title from "../layouts/Title";
import ProjectsCard from "./ProjectsCard";

// `githubLink` is the single per-card link slot. It holds a github.com repo URL
// OR a live-site URL; ProjectsCard renders a GitHub glyph for repos and an
// external/visit glyph for live sites, so the affordance always matches the URL.
const projectsData = [
  {
    title: "Shahek — Mobile App (React Native)",
    des: "Cross-platform mobile app built with React Native (Expo) and TypeScript — real-time chat over WebSockets, AI image generation, and Laravel REST API integration, shipped from Figma design to a published release.",
    githubLink: "https://github.com/AkramAlmnajed/shahek-mobile-ReactNative",
    tags: ["React Native", "Expo", "TypeScript", "WebSockets"],
    visibility: "Professional Project",
  },
  {
    title: "Shahek — Admin Dashboard (React.js)",
    des: "Management dashboard built with React.js, TypeScript, and Vite, consuming the Laravel REST API — role-based views, real-time chat, a feedback system, and day-to-day operational workflows.",
    githubLink: "https://dashboard.shahek.org/auth",
    tags: ["React.js", "TypeScript", "Vite", "Role-Based Views"],
    visibility: "Professional Project",
  },
  {
    title: "Shahek — Backend / REST API (Laravel)",
    des: "RESTful API built with Laravel (PHP) — versioned endpoints, email-OTP authentication, real-time chat via Laravel Reverb (WebSockets), generative-AI image integration, and Docker-based CI/CD deployment.",
    githubLink: "https://github.com/AkramAlmnajed/shahek-backend-Laravel",
    tags: ["Laravel", "PHP", "Laravel Reverb", "Docker / CI/CD"],
    visibility: "Professional Project",
  },
  {
    title: "Shahek — Company Website (WordPress)",
    des: "Company website on WordPress (PHP) — ongoing development and security hardening against fraud and phishing.",
    githubLink: "https://shahek.org/",
    tags: ["WordPress", "PHP", "Security Hardening"],
    visibility: "Professional Project",
  },
  {
    title: "Thiqa Education Platform",
    des: "Contributing to Version 1 of an online school platform at Thiqa Education. Focused on scalable React.js and TypeScript interfaces integrated with Express.js and Odoo services.",
    githubLink: "https://tutor-portal.thiqaeducation.com/login",
    tags: ["React.js", "TypeScript", "Express.js", "Odoo"],
    visibility: "Professional Project",
  },
  {
    title: "Architecture Company Platform (UAE)",
    des: "Developed a large-scale architecture platform using TypeScript, custom React hooks, and premium UI templates, integrated with an ASP.NET backend for structured data management.",
    githubLink: "https://github.com/AkramAlmnajed",
    tags: ["TypeScript", "React", "ASP.NET Integration"],
    visibility: "Private Delivery",
  },
  {
    title: "Emergency Assistance Map Platform",
    des: "Built a real-time interactive map application for conflict-affected communities with responsive UI and live data integration, optimized for reliability in low-bandwidth scenarios.",
    githubLink: "https://mapping.reparametrize.org/",
    tags: ["React.js", "Real-Time Data", "Responsive UI"],
    visibility: "Volunteer Project",
  },
  {
    title: "Event Venue Booking Application",
    des: "Implemented a full-featured booking platform with form validation and async data management using React Query, with backend services powered by Spring Boot APIs.",
    githubLink:
      "https://github.com/AkramAlmnajed/ReservationApp-Admin-Investor-Dashboard",
    tags: ["React.js", "TypeScript", "React Query", "Spring Boot"],
    visibility: "Public Repository",
  },
  {
    title: "Admin Dashboard for Venue Booking",
    des: "Developed an operations dashboard with user management, payment workflows, and approval pipelines using Axios, Material UI, and React Router for business administrators.",
    githubLink:
      "https://github.com/AkramAlmnajed/ReservationApp-Admin-Investor-Dashboard",
    tags: ["Material UI", "Axios", "Role-Based Flows"],
    visibility: "Public Repository",
  },
  {
    title: "Live Chatting Website",
    des: "Built a real-time chat application with private rooms, secure authentication, and Socket.io integration to support reliable low-latency communication.",
    githubLink: "https://github.com/AkramAlmnajed/Live-Chat-website",
    tags: ["React.js", "Socket.io", "Authentication"],
    visibility: "Resume Case Study",
  },
];

const Projects = () => {
  const reduce = useReducedMotion();
  return (
    <section id="projects" className="w-full py-24 lgl:py-32 sectionDivider">
      <Title title="SELECTED PROJECTS" des="Relevant Project Work" index={3} />
      <div className="mt-8 flex flex-col">
        {projectsData.map((project, i) => (
          <ProjectsCard
            key={project.title}
            index={i + 1}
            title={project.title}
            des={project.des}
            githubLink={project.githubLink}
            tags={project.tags}
            visibility={project.visibility}
          />
        ))}
      </div>

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex mt-10"
      >
        <motion.a
          whileTap={reduce ? undefined : { scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
          href="https://github.com/AkramAlmnajed"
          target="_blank"
          rel="noopener noreferrer"
          className="group goldHover overflow-hidden inline-flex items-center gap-3 px-6 h-12 rounded-control border border-line text-inkMuted font-monoFont text-mono uppercase tracking-[0.16em] transition-[color,transform] duration-base ease-out hover:text-ink active:scale-[0.97]"
        >
          View all on GitHub
          <span
            aria-hidden="true"
            className="transition-transform duration-base ease-out group-hover:translate-x-1"
          >
            →
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Projects;
