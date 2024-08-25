import React from 'react';
import Title from '../layouts/Title';
import { projectOne, projectTwo, projectThree } from "../../assets/index";
import ProjectsCard from './ProjectsCard';

const Projects = () => {
  return (
    <section
      id="projects"
      className="w-full py-20 border-b-[1px] border-b-black"
    >
      <div className="flex justify-center items-center text-center">
        <Title
          title="VISIT MY PORTFOLIO AND KEEP YOUR FEEDBACK"
          des="My Projects"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-14">
        <ProjectsCard
          title="Admin Dashboard"
          des="Developed an admin dashboard for a venue booking application that includes user management, payment processing, ad approval, and request handling. Also includes an investor interface for managing venues. This project utilized Axios, Material UI, React Router, and was built entirely using React.js."
          src={projectOne}
          githubLink="https://github.com/AkramAlmnajed/ReservationApp-Admin-Investor-Dashboard"
        />
        <ProjectsCard
          title="Crypto Market"
          des="Built a crypto market application that fetches cryptocurrency prices using the Coinstate API. Features include search functionality, sorting options, and a toggle between light and dark modes. Axios was used for GET requests, and the project was developed using React.js."
          src={projectTwo}
          githubLink="https://github.com/AkramAlmnajed/Crypto-Market"
        />
        <ProjectsCard
          title="Live Chatting Website"
          des="Created a live chatting website where users can register with a name and room ID to chat in private rooms. Implemented using Socket.io and Node.js for the backend, with CORS for cross-origin resource sharing. This project was also developed using React.js."
          src={projectThree}
          githubLink="https://github.com/AkramAlmnajed/Live-Chat-app"
        />
      </div>
    </section>
  );
}

export default Projects;
