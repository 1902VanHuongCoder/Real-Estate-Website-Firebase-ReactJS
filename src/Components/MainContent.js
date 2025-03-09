import React from "react";
import News from "./News";
import Filter from "./Filter";
import FilterOnMobile from "./FilterOnMobile";

const MainContent = () => {
  return (
    <div className="sm:flex h-fit px-4">
      <FilterOnMobile />
      <News />
      <Filter />
      {/* <Example /> */}
    </div>
  );
};

export default MainContent;
