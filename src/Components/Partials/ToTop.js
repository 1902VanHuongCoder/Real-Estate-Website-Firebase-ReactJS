// 📦 Import hooks
import React, { useState, useEffect } from "react";

// 📦 Import icons
import { FaArrowUp } from "react-icons/fa";

// 📦 Import libraries
import { useLocation } from "react-router-dom";

// 🏷️ ToTop component
const ToTop = () => {
  const location = useLocation();
  const [showButton, setShowButton] = useState(false);

  // 📝 Handle scroll event to show/hide button
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 📝 Handle scroll to top
  const handleToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    location.pathname !== "/staff/login" &&
    showButton && (
      <button
        onClick={handleToTop}
        className="fixed right-5 bottom-5 w-[60px] h-[60px] border-[2px] border-solid border-[#CC8C08] text-[#CC8C08] bg-white font-medium text-xl flex justify-center items-center shadow-md rounded-full z-[19]"
      >
        <FaArrowUp />
      </button>
    )
  );
};

export default ToTop;
