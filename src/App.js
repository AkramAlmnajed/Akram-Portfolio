import React from "react";
import Banner from "./components/banner/Banner";
import Contact from "./components/contact/Contact";
import Features from "./components/features/Features";
import FooterBottom from "./components/footer/FooterBottom";
import Navbar from "./components/navbar/Navbar";
import Projects from "./components/projects/Projects";
import Resume from "./components/resume/Resume";

function App() {
  return (
        <div className="w-full h-auto bg-bodyColor text-lightText p-4 overflow-hidden">
<Navbar />
      <div className="max-w-screen-xl mx-auto overflow-hidden">
        <Banner />
        <Features />
        <Projects />
        <Resume />
        <Contact />
        <FooterBottom />
      </div>
    </div>
  );
}

export default App;
