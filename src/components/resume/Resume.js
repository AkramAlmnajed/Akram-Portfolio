import React from "react";
import Title from "../layouts/Title";
import Experience from "./Experience";

const Resume = () => {
  return (
    <section id="resume" className="w-full py-24 sectionDivider">
      <div className="flex justify-center items-center text-center">
        <Title title="PROFESSIONAL EXPERIENCE" des="Work Experience" />
      </div>
      <div className="mt-6">
        <Experience />
      </div>
    </section>
  );
};

export default Resume;
