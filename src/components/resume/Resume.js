import React from "react";
import Title from "../layouts/Title";
import Experience from "./Experience";

const Resume = () => {
  return (
    <section id="resume" className="w-full py-24 lgl:py-28 sectionDivider">
      <Title title="PROFESSIONAL EXPERIENCE" des="Work Experience" index={1} />
      <div className="mt-6">
        <Experience />
      </div>
    </section>
  );
};

export default Resume;
