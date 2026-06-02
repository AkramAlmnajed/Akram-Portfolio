import React from "react";
import LeftBanner from "./LeftBanner";
import RightBanner from "./RightBanner";
const Banner = () => {
  return (
    <section
      id="home"
      className="relative isolate w-full overflow-visible font-titleFont pt-28 lgl:pt-32 pb-20 sectionDivider"
    >
      {/* Content stays within the readable container and aligns with the sections below */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 w-full flex flex-col gap-14 xl:gap-0 lgl:flex-row items-center">
        <LeftBanner />
        <RightBanner />
      </div>
    </section>
  );
};

export default Banner;
