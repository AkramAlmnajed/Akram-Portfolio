import React from "react";
import { motion } from "framer-motion";
import ResumeCard from "./ResumeCard";

const Experience = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="w-full flex flex-col lgl:flex-row gap-10 lgl:gap-20"
    >
      <div>
        <div className="py-6 lgl:py-12 font-titleFont flex flex-col gap-4">
          <p className="text-sm text-designColor tracking-[4px]">2021 - Present</p>
          <h2 className="text-3xl md:text-4xl font-bold">Work Experience</h2>
        </div>
        <div className="mt-6 lgl:mt-14 w-full h-[1000px] border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="React.js Developer"
            subTitle="Freelance Developer (2023 - Present)"
            des="Developed several training projects using React.js, focusing on responsive design, API integration, and modern front-end practices."
            result="Syria"
          />
          <ResumeCard
            title="Flutter Mobile App Developer"
            subTitle="Freelance Developer (2022 - 2023)"
            des="Built and deployed mobile applications using Flutter, with a focus on API integration and state management using BLoC."
            result="Syria"
          />
          <ResumeCard
            title="RBCS Team Member"
            subTitle="Volunteer (2021 - 2023)"
            des="Contributed to writing and organizing college lectures, making them accessible to students for free."
            result="Syria"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Experience;
