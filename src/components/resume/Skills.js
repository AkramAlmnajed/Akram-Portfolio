import React from "react";
import { motion } from "framer-motion";
import Title from "../layouts/Title";

const Skills = () => {
  const skillGroups = [
    {
      title: "Core Technologies",
      items: [
        "React.js",
        "Next.js",
        "TypeScript",
        "JavaScript (ES6+)",
        "HTML5",
        "CSS3",
      ],
    },
    {
      title: "State & Data",
      items: [
        "React Query",
        "Redux",
        "React Hooks",
        "Context API",
        "Axios",
        "Fetch API",
      ],
    },
    {
      title: "UI Engineering",
      items: [
        "Tailwind CSS",
        "Material UI",
        "Shadcn/UI",
        "Responsive Design",
        "Cross-Browser Compatibility",
      ],
    },
    {
      title: "API & Backend Integration",
      items: [
        "RESTful APIs",
        "Express.js",
        "ASP.NET",
        "Spring Boot",
        "Laravel",
        "Odoo",
      ],
    },
    {
      title: "Architecture & Quality",
      items: [
        "Feature-Sliced Design (FSD)",
        "Modular Design",
        "Component Reusability",
        "Performance Optimization",
        "Clean Code",
      ],
    },
    {
      title: "Tooling & Team Practices",
      items: [
        "Git",
        "GitHub",
        "Jest",
        "Cypress",
        "Code Review",
        "Agile / Scrum",
      ],
    },
  ];

  const SkillBadge = ({ title }) => (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-[#0f172d] border border-slate-700/70 py-2.5 px-4 rounded-xl text-slate-300 shadow-md flex items-center justify-center text-center text-sm font-medium cursor-default hover:border-blue-400/80 hover:shadow-[0_0_15px_rgba(59,130,246,0.25)] hover:text-white transition-all duration-300"
    >
      {title}
    </motion.div>
  );

  return (
    <section id="skills" className="w-full py-24 sectionDivider">
      <div className="flex justify-center items-center text-center">
        <Title title="STACK & SKILLS" des="Technical Expertise" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 mt-8"
      >
        {skillGroups.map((group, index) => (
          <motion.article
            key={group.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            viewport={{ once: true }}
            className="glassCard p-6 md:p-7"
          >
            <h3 className="text-xl text-white font-bold mb-5">{group.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.items.map((skill) => (
                <SkillBadge key={skill} title={skill} />
              ))}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default Skills;
