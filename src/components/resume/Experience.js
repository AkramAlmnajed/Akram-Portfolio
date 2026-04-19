import React from "react";
import { motion } from "framer-motion";
import ResumeCard from "./ResumeCard";

const experienceData = [
  {
    title: "Front-End Web Developer",
    company: "Thiqa Education",
    period: "Oct 2025 - Present",
    employmentType: "Remote, Part-Time",
    location: "UAE",
    highlights: [
      "Contributing to the front-end development of Version 1 of an online school platform using React.js and TypeScript within a structured engineering team.",
      "Integrating front-end components with an Express.js backend and Odoo, handling API connectivity and data flow across the platform's full-stack architecture.",
      "Collaborating remotely in code reviews and Agile delivery cycles while maintaining shared standards for quality and maintainability.",
    ],
  },
  {
    title: "React.js / Next.js Developer",
    company: "Freelance",
    period: "Jul 2023 - Present",
    employmentType: "Contract",
    location: "Damascus, Syria",
    highlights: [
      "Planned and delivered 5+ production-ready applications using React.js, Next.js, and TypeScript across booking platforms, real-time tools, and enterprise dashboards.",
      "Built reusable component libraries and integrated REST APIs from ASP.NET, Spring Boot, and Laravel backends using Axios with consistent async patterns.",
      "Applied Feature-Sliced Design (FSD), modular architecture, and performance techniques such as lazy loading, code splitting, and memoization.",
    ],
  },
  {
    title: "Volunteer React.js Developer",
    company: "Reparametrize Foundation",
    period: "Jun 2023 - Present",
    employmentType: "Volunteer",
    location: "Damascus, Syria",
    highlights: [
      "Collaborated with a volunteer engineering team to build the Emergency Assistance Map Platform for communities in conflict-affected regions.",
      "Developed interactive map components with real-time data integration and responsive behavior for low-bandwidth environments.",
      "Participated in code reviews and maintained shared quality standards in an Agile team workflow.",
    ],
  },
  {
    title: "Front-End Web Developer Intern",
    company: "90Soft & Fractals Company",
    period: "Aug 2023 - Nov 2023",
    employmentType: "Internship",
    location: "Damascus, Syria",
    highlights: [
      "Contributed production front-end components in React.js applications and integrated Laravel-backed RESTful APIs.",
      "Improved UI rendering performance and gained practical exposure to collaborative engineering ceremonies and code reviews.",
    ],
  },
];

const Experience = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="w-full flex flex-col gap-10"
    >
      <div>
        <div className="mt-4 lgl:mt-10 w-full h-auto border-l-[2px] border-l-slate-700/60 flex flex-col gap-8">
          {experienceData.map((item) => (
            <ResumeCard
              key={item.company + item.period}
              title={item.title}
              company={item.company}
              period={item.period}
              employmentType={item.employmentType}
              location={item.location}
              highlights={item.highlights}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Experience;
