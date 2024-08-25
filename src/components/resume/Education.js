import React from "react";
import { motion } from "framer-motion";
import ResumeCard from "./ResumeCard";

const Education = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="w-full flex flex-col lgl:flex-row gap-10 lgl:gap-20"
    >
      {/* part one */}
      <div>
        <div className="py-6 lgl:py-12 font-titleFont flex flex-col gap-4">
          <p className="text-sm text-designColor tracking-[4px]">2019 - Present</p>
          <h2 className="text-3xl md:text-4xl font-bold">Education Quality</h2>
        </div>
        <div className="mt-6 lgl:mt-14 w-full h-[1000px] border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="Bachelor's Degree in Software Engineering"
            subTitle="Damascus University (2019 - Present)"
            des="Currently pursuing a degree in Software Engineering, focusing on web development and modern software practices."
            result="Syria"
          />
        </div>
      </div>
      {/* part Two */}

      <div>
        <div className="py-6 lgl:py-12 font-titleFont flex flex-col gap-4">
          <p className="text-sm text-designColor tracking-[4px]">2020 - Present</p>
          <h2 className="text-3xl md:text-4xl font-bold">Certifications & Courses</h2>
        </div>
        <div className="mt-6 lgl:mt-14 w-full h-[1000px] border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="Python for Everybody"
            subTitle="Coursera (2020)"
            des="Completed a comprehensive course on Python programming, focusing on the basics to advanced concepts of Python."
            result="Syria"
          />
          <ResumeCard
            title="Flutter Development"
            subTitle="Abdullah Mansour's Course (2021)"
            des="Gained proficiency in mobile app development using Flutter, with a focus on BLoC state management and API integration."
            result="Syria"
          />
          <ResumeCard
            title="React.js Development"
            subTitle="Tarmeez Academy (2023)"
            des="Completed a specialized course on React.js, focusing on building dynamic and responsive web applications."
            result="Syria"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Education;
