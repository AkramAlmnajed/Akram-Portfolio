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
import CustomCursor from "./components/layouts/CustomCursor";
import TouchGlow from "./components/layouts/TouchGlow";
import SmoothScroll from "./components/layouts/SmoothScroll";
import ScrollProgress from "./components/layouts/ScrollProgress";
import { getLenis } from "./components/layouts/lenisStore";

function App() {
  return (
    <div className="w-full h-auto text-inkMuted overflow-hidden relative">
      <a
        href="#home"
        onClick={(e) => {
          const lenis = getLenis();
          if (lenis) {
            e.preventDefault();
            lenis.scrollTo(0, { offset: 0 });
          }
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accentText"
      >
        Skip to content
      </a>
      <AmbientBackground />
      <CustomCursor />
      <TouchGlow />
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />
      <main>
        {/* Full-bleed hero — spans the full viewport width, no side or top-left gap */}
        <Banner />
        {/* Contained content sections */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 overflow-visible">
          <Resume />
          <Credentials />
          <Projects />
          <Skills />
          <Contact />
          <FooterBottom />
        </div>
      </main>
    </div>
  );
}

export default App;
