// 📦 Import hooks and official imports
import React from "react";

// 📷 Import images
import banner from "../images/Banner.jpg";

// 🏷️ Hero component
const Hero = () => {
  return (
    <div className="relative w-full h-fit bg-cover bg-center bg-no-repeat">
      {/* 🖼️ Banner image */}
      <img src={banner} alt="banner" className="w-full h-full object-cover" />
    </div>
  );
};

export default Hero;
