import React from "react";
import LeftBanner from "./LeftBanner";
import RightBanner from "./RightBanner";
const Banner = () => {
  return (
    <section
      id="home"
      className="w-full pt-8 pb-20 flex flex-col gap-14 xl:gap-0 lgl:flex-row items-center sectionDivider font-titleFont relative isolate overflow-visible"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-[-40%_-24%_-32%_-24%] bg-[radial-gradient(ellipse_at_70%_46%,_rgba(59,130,246,0.18)_0%,_rgba(59,130,246,0.1)_20%,_rgba(56,189,248,0.06)_36%,_rgba(15,23,42,0)_72%),radial-gradient(ellipse_at_34%_30%,_rgba(125,211,252,0.08)_0%,_rgba(15,23,42,0)_60%)] blur-[140px]" />
        <div className="absolute inset-[-32%_-18%_-26%_-18%] bg-[radial-gradient(ellipse_at_60%_56%,_rgba(37,99,235,0.08)_0%,_rgba(15,23,42,0)_70%)] blur-[165px] opacity-90" />
      </div>
      <LeftBanner />
      <RightBanner />
    </section>
  );
};

export default Banner;
