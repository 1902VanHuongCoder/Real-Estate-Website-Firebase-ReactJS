// 📦 Import hooks
import React, { useContext, useState } from "react";

// 📦 Import icons
import { FaArrowLeft } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

// 📦 Import Framer Motion Library
import { motion } from "framer-motion";

// 🌐 Import contexts
import { AppContext } from "../Context/AppContext";

// 📦 Import components
import { NavItems } from "./Middle";

// 📦 Import datas
import { rentItems, saleItems } from "../datas/navdatas";

import logo from "../images/logo.png";
import { Link } from "react-router-dom";
// 🎨 Create variants to create animation for sidebar
const toggleMenu = {
  open: {
    height: "fit-content",
    transition: {
      duration: 0.2,
    },
  },
  close: {
    height: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const sideBarAnimate = {
  open: {
    left: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  close: {
    left: "-110%",
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// 🏷️ Sidebar component
const Sidebar = () => {
  const [toggle, setToggle] = useState({
    item1: false,
    item2: false,
  });

  const { sideBarOpen, setSideBarOpen } = useContext(AppContext);

  return (
    <motion.div
      animate={sideBarOpen ? "open" : "close"}
      initial={false}
      variants={sideBarAnimate}
      className="w-full fixed top-0 left-0 px-4 py-5 bg-[#CC8C08] h-screen z-50 overflow-y-scroll"
    >
      <div className="flex justify-between  border-b-[1px] border-b-solid border-b-white pb-5">
        <Link to="/">
          <span className="w-[60px] h-[60px] rounded-full overflow-hidden">
            <img
              src={logo}
              alt="logo"
              className="mr-3 w-full h-full object-cover"
            />
          </span>
        </Link>

        <button
          onClick={() => setSideBarOpen(!sideBarOpen)}
          className="text-white text-xl border-[2px] border-solid border-white flex justify-center items-center w-[60px] h-[60px] rounded-full"
        >
          <FaArrowLeft />
        </button>
      </div>
      <div className="pt-5 text-white">
        <ul className="flex gap-x-3 flex-col text-lg gap-y-5">
          <li className="relative flex flex-col items-start gap-x-1">
            <span
              onClick={() => {
                setToggle({ ...toggle, item1: !toggle.item1 });
              }}
              className="flex items-center gap-x-2 cursor-pointer"
            >
              Nhà đất thuê{" "}
              <span>
                <IoIosArrowDown />
              </span>
            </span>
            <motion.ul
              animate={toggle.item1 ? "open" : "close"}
              variants={toggleMenu}
              className="pl-3 pt-2 overflow-hidden"
            >
              {rentItems.map((item, index) => (
                <NavItems key={index} content={item} />
              ))}
            </motion.ul>
          </li>
          <li className="relative flex flex-col gap-x-1 items-start">
            <span
              onClick={() => {
                setToggle({ ...toggle, item2: !toggle.item2 });
              }}
              className="flex items-center gap-x-2 cursor-pointer"
            >
              Nhà đất bán{" "}
              <span>
                <IoIosArrowDown />
              </span>
            </span>
            <motion.ul
              animate={toggle.item2 ? "open" : "close"}
              variants={toggleMenu}
              className="pl-3 pt-2 overflow-hidden"
            >
              {saleItems.map((item, index) => (
                <NavItems key={index} content={item} />
              ))}
            </motion.ul>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;
