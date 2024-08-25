import React from 'react'
import { FaMobileAlt, FaServer, FaReact } from "react-icons/fa";
import { SiFlutter, SiAntdesign, SiCoursera } from "react-icons/si";
import Title from '../layouts/Title';
import Card from './Card';

const Features = () => {
  return (
    <section
      id="features"
      className="w-full py-20 border-b-[1px] border-b-black"
    >
      <Title title="Features" des="What I Do" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-20">
        <Card
          title="React.js Development"
          des="I specialize in developing interactive and responsive web applications using React.js. This includes building complex UI components, managing application state, and integrating APIs to deliver dynamic content."
          icon={<FaReact/>}
        />
        <Card
          title="Flutter Mobile Development"
          des="I develop cross-platform mobile applications using Flutter. I utilize the BLoC pattern for state management and integrate APIs using the Dio library to ensure efficient data handling and smooth performance across different devices."
          icon={<SiFlutter/>}
        />
        <Card
          title="UI/UX Design"
          des="I design and implement user-friendly and visually appealing interfaces. My focus is on creating intuitive user experiences by developing small-scale interactive UI component libraries and optimizing usability."
          icon={<SiAntdesign/>}
        />
        <Card
          title="API Integration"
          des="I am proficient in integrating APIs to display dynamic data and update user interfaces in real-time. I use libraries such as Axios in React.js and Dio in Flutter to ensure efficient data communication and management."
          icon={<FaServer/>}
        />
        <Card
          title="Web and Mobile App Deployment"
          des="I handle the deployment and distribution of web and mobile applications, ensuring they run smoothly on various platforms and devices. This includes building and deploying apps with a focus on performance and reliability."
          icon={<FaMobileAlt/>}
        />
        <Card
          title="Continuous Learning and Improvement"
          des="I am committed to continuous learning and skill enhancement in modern development practices, particularly in JavaScript, React.js, and Flutter. I stay updated with the latest trends and technologies to deliver high-quality solutions."
          icon={<SiCoursera/>}
        />
      </div>
    </section>
  );
}

export default Features