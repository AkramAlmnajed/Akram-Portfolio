import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Title from "../layouts/Title";
import ProjectsCard from "./ProjectsCard";

// `githubLink` is the single per-card link slot. It holds a github.com repo URL
// OR a live-site URL; ProjectsCard renders a GitHub glyph for repos and an
// external/visit glyph for live sites, so the affordance always matches the URL.
const projectsData = [
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
