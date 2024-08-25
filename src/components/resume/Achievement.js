import React from "react";
import { motion } from "framer-motion";
import ResumeCard from "./ResumeCard";

const Achievement = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="w-full flex flex-col lgl:flex-row gap-10 lgl:gap-20"
    >
      <div>
        <div className="py-6 lgl:py-12 font-titleFont flex flex-col gap-4">
          <p className="text-sm text-designColor tracking-[4px]">2023 - Present</p>
          <h2 className="text-3xl md:text-4xl font-bold">Achievements</h2>
        </div>
        <div className="mt-6 lgl:mt-14 w-full h-[1000px] border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <ResumeCard
            title="Completed Admin Dashboard Project"
            subTitle="React.js Project (2024)"
            des="Successfully completed an admin dashboard project in React.js, integrating APIs, state management, and Material UI."
            result="Syria"
          />
          <ResumeCard
            title="Developed Crypto Market Project"
            subTitle="React.js Project (2024)"
            des="Built a crypto market project utilizing the Coinstate API, with a focus on search, sorting, and dark/light modes."
            result="Syria"
          />
          <ResumeCard
            title="Developed Live Chatting Website"
            subTitle="React.js & Node.js Project (2024)"
            des="Created a real-time live chatting website using Socket.io and Node.js, with private chatroom functionality."
            result="Syria"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Achievement;
