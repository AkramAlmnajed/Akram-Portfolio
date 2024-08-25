import React from 'react';
import { bannerImg } from "../../assets/index";

const RightBanner = () => {
  return (
    <div className="w-full lgl:w-1/2 flex justify-center items-center relative">
      <img
        className="w-[480px] h-auto lgl:w-[480px] lgl:h-auto z-10 object-contain"
        src={bannerImg}
        alt="bannerImg"
        style={{ clipPath: 'circle(50%)' }} 
      />
      <div className="absolute bottom-0 w-[480px] h-[400px] lgl:w-[600px] lgl:h-[600px] bg-transparent shadow-none flex justify-center items-center"></div>
    </div>
  );
}

export default RightBanner;
