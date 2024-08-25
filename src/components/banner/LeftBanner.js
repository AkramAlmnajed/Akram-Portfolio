import React from 'react';
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { FaFacebookF, FaTelegramPlane, FaLinkedinIn, FaReact } from "react-icons/fa";
import { SiTailwindcss, SiFlutter, SiMaterialui } from "react-icons/si";

const LeftBanner = () => {
    const [text] = useTypewriter({
      words: ["Professional Coder.", "Front End Developer.", "React js Developer." , "UI Designer."],
      loop: true,
      typeSpeed: 20,
      deleteSpeed: 10,
      delaySpeed: 2000,
    });

  return (
    <div className="w-full lgl:w-1/2 flex flex-col gap-20">
      <div className="flex flex-col gap-5">
        <h1 className="text-5xl font-bold text-white">
          Hi, I'm <span className="text-designColor capitalize">Akram Almnajed</span>
        </h1>
        <h2 className="text-4xl font-bold text-white">
          a <span>{text}</span>
          <Cursor
            cursorBlinking="false"
            cursorStyle="|"
            cursorColor="#ff014f"
          />
        </h2>
        <p className="text-base font-bodyFont leading-6 tracking-wide">
        I'm Akram Al-Mnajed, a front-end developer from Damascus, Syria, and a Information Engineering student at Damascus University, specializing in Software Engineering.
        I have two years of front-end development experience—one year working with Flutter to develop Android apps, and another year focusing on React.js for web development.
        I'm passionate about continuous learning and always eager to expand my skills.
        </p>
      </div>
      <div className="flex flex-col xl:flex-row gap-6 lgl:gap-0 justify-between">
        <div>
          <h2 className="text-base uppercase font-titleFont mb-4">
            Find me in
          </h2>
          <div className="flex gap-4">
            <a href="https://facebook.com/Akram.Almnajed" target="_blank" rel="noopener noreferrer" className="bannerIcon">
              <FaFacebookF />
            </a>
            <a href="https://t.me/Almnajed" target="_blank" rel="noopener noreferrer" className="bannerIcon">
              <FaTelegramPlane />
            </a>
            <a href="https://www.linkedin.com/in/akram-almnajed-5a06801a6/" target="_blank" rel="noopener noreferrer" className="bannerIcon">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-base uppercase font-titleFont mb-4">
            BEST SKILLS ON
          </h2>
          <div className="flex gap-4">
            <a href="https://reactjs.org/docs/getting-started.html" target="_blank" rel="noopener noreferrer" className="bannerIcon">
              <FaReact />
            </a>
            <a href="https://docs.flutter.dev/" target="_blank" rel="noopener noreferrer" className="bannerIcon">
              <SiFlutter />
            </a>
            <a href="https://tailwindcss.com/docs" target="_blank" rel="noopener noreferrer" className="bannerIcon">
              <SiTailwindcss />
            </a>
            <a href="https://mui.com/material-ui/getting-started/overview/" target="_blank" rel="noopener noreferrer" className="bannerIcon">
              <SiMaterialui />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftBanner;
