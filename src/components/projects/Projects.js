import React from "react";
import { motion } from "framer-motion";
import Title from "../layouts/Title";
import ProjectsCard from "./ProjectsCard";

const projectsData = [
  {
    title: "Thiqa Education Platform",
    des: "Contributing to Version 1 of an online school platform at Thiqa Education. Focused on scalable React.js and TypeScript interfaces integrated with Express.js and Odoo services.",
    githubLink: "https://github.com/AkramAlmnajed",
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
    githubLink: "https://github.com/AkramAlmnajed",
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
    githubLink: "https://github.com/AkramAlmnajed",
    tags: ["React.js", "Socket.io", "Authentication"],
    visibility: "Resume Case Study",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="w-full py-24 sectionDivider">
      <div className="flex justify-center items-center text-center">
        <Title title="SELECTED PROJECTS" des="Relevant Project Work" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-7 mt-8">
        {projectsData.map((project) => (
          <ProjectsCard
            key={project.title}
            title={project.title}
            des={project.des}
            githubLink={project.githubLink}
            tags={project.tags}
            visibility={project.visibility}
          />
        ))}
      </div>

      <div className="w-full flex justify-center mt-12">
        <motion.a
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          href="https://github.com/AkramAlmnajed"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 h-12 rounded-xl border border-blue-400/35 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-blue-100 font-semibold tracking-[0.12em] uppercase text-sm shadow-[0_18px_40px_-30px_rgba(56,189,248,0.95)] hover:border-blue-300/60 hover:text-white hover:shadow-[0_20px_50px_-28px_rgba(59,130,246,0.95)] transition-all duration-300"
        >
          Show More
        </motion.a>
      </div>
    </section>
  );
};

export default Projects;
