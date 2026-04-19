import React from "react";
import Banner from "./components/banner/Banner";
import Contact from "./components/contact/Contact";
import FooterBottom from "./components/footer/FooterBottom";
import Navbar from "./components/navbar/Navbar";
import Projects from "./components/projects/Projects";
import Resume from "./components/resume/Resume";
import Credentials from "./components/resume/Credentials";
import Skills from "./components/resume/Skills";
import AmbientBackground from "./components/layouts/AmbientBackground";

function App() {
  return (
    <div className="w-full h-auto bg-bodyColor text-lightText px-4 md:px-6 overflow-hidden relative">
      <AmbientBackground />
      <Navbar />
      <div className="max-w-screen-xl mx-auto overflow-visible pt-24">
        <Banner />
        <Resume />
        <Credentials />
        <Projects />
        <Skills />
        <Contact />
        <FooterBottom />
      </div>
    </div>
  );
}

export default App;
