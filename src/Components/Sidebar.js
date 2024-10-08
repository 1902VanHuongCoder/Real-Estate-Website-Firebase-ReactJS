// import hooks
import React, { useContext, useState } from "react";

// import icons
import { FaArrowLeft } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

// import Framer Motion Library 
import { motion } from "framer-motion";

// import Context
import { AppContext } from "../Context/AppContext";

// import components
import { NavItems } from "./Middle";

// import datas
import { rentItems, saleItems} from '../datas/navdatas';

// create variants to creat animation for sidebar
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
    open:{
        left: 0,
        opacity: 1,
        transition:{
            duration: 0.5
        }
    },
    close:{

        left: "-110%",
        opacity: 0,
        transition: {
            duration: 0.5
        }
    }
}

const Sidebar = () => {
  const [toggle, setToggle] = useState({
    item1: false,
    item2: false,
  });

  const {sideBarOpen, setSideBarOpen} = useContext(AppContext);

  return (
    <motion.div animate={sideBarOpen ? "open" : "close"} initial={false} variants={sideBarAnimate} className="w-90 md:w-2/4 fixed top-0 left-0 px-10 py-10 bg-[#40A2D8] h-screen z-50 overflow-y-scroll">
      <div className="flex gap-x-1 md:gap-x-4 border-b-[1px] border-b-solid border-b-white pb-5">
        <img src="./images/logo.png" alt="logo" className="mr-3 h-20" />
        <span className="self-end whitespace-nowrap text-white text-xl md:text-2xl font-semibold dark:text-white">
          BDS Văn Hưởng
        </span>
      </div>
      <div className="pt-5 text-white">
        <ul className="flex gap-x-3 flex-col text-lg gap-y-5">
          <li className="relative flex flex-col items-start gap-x-1">
            <span
              onClick={() => {
                setToggle({ ...toggle, item1: !toggle.item1 });
              }}
              className="flex items-center gap-x-2"
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
              {rentItems.map((item, index) => {
                return <NavItems key={index} content={item} />;
              })}
            </motion.ul>
          </li>
          <li className="relative flex flex-col gap-x-1 items-start">
            <span
              onClick={() => {
                setToggle({ ...toggle, item2: !toggle.item2 });
              }}
              className="flex items-center gap-x-2"
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
              {saleItems.map((item, index) => {
                return <NavItems key={index} content={item} />;
              })}
            </motion.ul>
          </li>
        </ul>
      </div>
      <button onClick={() => setSideBarOpen(!sideBarOpen)} className="absolute top-5 right-10 w-[50px] h-[50px] flex justify-center items-center border-[1px] border-solid border-white rounded-full hover:opacity-80">
        <FaArrowLeft className="text-white" />
      </button>
    </motion.div>
  );
};

export default Sidebar;