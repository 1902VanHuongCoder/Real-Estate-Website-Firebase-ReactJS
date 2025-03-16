// import hooks
import React, { useContext } from "react";

import { AnimatePresence, motion } from "framer-motion";

// import icons
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { AppContext } from "../../Context/AppContext";

const Notification = () => {
  const { showNotification, setShowNotification } = useContext(AppContext);
  const notificationVariants = {
    initial: {
      height: 0,
    },
    show: {
      height: "50px",
      transition: {
        duration: 0.2,
      },
    },
    hidden: {
      scale: 0,
      transition: {
        duration: 0.2,
      },
    },
  };
  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          key="notification"
          variants={notificationVariants}
          animate="show"
          exit="hidden"
          initial="initial"
          className={`absolute top-0 left-0 z-50 w-full gap-x-1 min-h-[50px] mx-auto flex items-center justify-between px-2 sm:px-5 text-white ${
            showNotification.type === "error" && "bg-red-500"
          } ${showNotification.type === "success" && "bg-[#06D001]"} ${
            showNotification.type === "warning" && "bg-yellow-500"
          }`}
        >
          {showNotification.type === "error" && (
            <div className="flex gap-x-1 items-center">
              <span>
                <FaCheckCircle />
              </span>
              <span>{showNotification.message}</span>
            </div>
          )}
          {showNotification.type === "success" && (
            <div className="flex gap-x-1 items-center">
              <span>
                <FaCheckCircle />
              </span>
              <span>{showNotification.message}</span>
            </div>
          )}
          {showNotification.type === "warning" && (
            <div className="flex gap-x-1 items-center">
              <span>
                <FaCheckCircle />
              </span>
              <span>{showNotification.message}</span>
            </div>
          )}
          <span
            onClick={() => setShowNotification(false)}
            className="text-white text-xl"
          >
            <IoMdCloseCircle />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
