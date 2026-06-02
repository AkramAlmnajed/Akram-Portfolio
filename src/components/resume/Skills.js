import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Title from "../layouts/Title";

const Skills = () => {
  const reduce = useReducedMotion();

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

  return (
    <section id="skills" className="w-full py-24 lgl:py-28 sectionDivider">
      <Title title="STACK & SKILLS" des="Technical Expertise" index={4} />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-10 mt-8">
        {skillGroups.map((group, index) => (
          <motion.article
            key={group.title}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: reduce ? 0 : index * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col gap-4 border-t border-line pt-5"
          >
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-6 bg-accent shrink-0" />
              <h3 className="font-monoFont text-mono uppercase tracking-[0.18em] text-accent">
                {group.title}
              </h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <li
                  key={skill}
                  className="goldHover overflow-hidden font-monoFont text-mono text-inkMuted border border-line rounded-hairline px-2.5 py-1 cursor-default transition-[color,transform] duration-base ease-out hover:text-ink hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default Skills;
