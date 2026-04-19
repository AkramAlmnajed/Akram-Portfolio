import React from "react";

const Title = ({ title, des }) => {
  return (
    <div className="flex flex-col gap-3 font-titleFont mb-14">
      <h3 className="text-xs uppercase font-semibold text-designColor tracking-[0.24em]">
        {title}
      </h3>
      <h1 className="text-3xl md:text-5xl text-slate-100 font-bold capitalize leading-tight">
        {des}
      </h1>
    </div>
  );
};

export default Title;
