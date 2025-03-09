import React from "react";
import { Transitions, Hero, MainContent } from "./helpers";

const Home = () => {
  return (
    <Transitions>
      <div className="relative w-screen mx-auto overflow-hidden">
        <Hero />
        <MainContent />
      </div>
    </Transitions>
  );
};
export default Home;
