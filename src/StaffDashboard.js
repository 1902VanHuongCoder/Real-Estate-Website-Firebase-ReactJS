// 📦 Import hooks
import React, { useContext } from "react";

// 📷 Import images
import building from "./images/buiding+01.jpg";
import companyLogo from "./images/logo.png";

// 🌐 Import contexts
import { AppContext } from "./Context/AppContext";

// 📦 Import libraries
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { createNewChat } from "./firebase-helpers";

// 🏷️ StaffDashboard component
const StaffDashboard = () => {
  const { showCongratulation, setShowCongratulation } = useContext(AppContext);
  const { session } = useContext(AppContext);
  const navigate = useNavigate();
  const handleChatWithAdmin = () => {
    const postData = {
      userId: "GNPerZEAxnTznxRfO74wwvs1pUe2",
    };
    createNewChat(postData, session);
    navigate("/chat");
  };
  const location = useLocation();
  if (showCongratulation) {
    setTimeout(() => {
      setShowCongratulation(false);
    }, 5000);
  }

  return (
    <div className="w-full h-fit mb-5">
      <div
        className="relative text-white w-full h-[400px] bg-cover rounded-b-xl overflow-hidden"
        style={{ backgroundImage: `url("${building}")` }}
      >
        <div className="top-0 left-0 absolute w-full h-full flex justify-center items-center flex-col gap-y-2 sm:flex-row gap-x-8 bg-[rgba(0,0,0,.4)]">
          <div>
            <img
              src={companyLogo}
              alt="company logo"
              className="w-[150px] h-[150px] rounded-full"
            />
          </div>
          <div className="flex flex-col gap-y-2 items-center sm:items-start">
            <p className="text-md sm:text-xl">Công ty Bất Động Sản</p>
            <h1 className="text-4xl sm:text-8xl text-center drop-shadow-md ">
              Văn Hưởng
            </h1>
            <p className="text-lg hidden sm:block">
              Uy tín - Tận tâm - Hiệu quả
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="relative mt-5 w-full flex items-center justify-between h-[60px] border-y-[1px] border-solid border-slate-200">
        <ul className="flex w-full h-full text-lg">
          <Link
            to="/staff/list+posts+of+staff"
            className={`relative px-5 flex justify-center items-center ${
              location.pathname === "/staff/list+posts+of+staff"
                ? "bg-[#CC8C08] text-white"
                : ""
            }`}
          >
            <span className="relative flex items-center gap-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-list"
              >
                <path d="M3 12h.01" />
                <path d="M3 18h.01" />
                <path d="M3 6h.01" />
                <path d="M8 12h13" />
                <path d="M8 18h13" />
                <path d="M8 6h13" />
              </svg>
              <span className="hidden sm:inline">Danh sách bài đăng</span>
            </span>
          </Link>

          <Link
            to="/real+estate/post"
            className={`relative px-5 flex justify-center items-center ${
              location.pathname === "/real+estate/post"
                ? "bg-[#CC8C08] text-white"
                : ""
            }`}
          >
            <span className="relative flex items-center gap-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-plus"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
              <span className="hidden sm:inline">Thêm tài sản</span>
            </span>
          </Link>

          <Link
            to="/chat"
            className={`relative px-5 flex justify-center items-center ${
              location.pathname === "/chat" ? "bg-[#CC8C08] text-white" : ""
            }`}
          >
            <span className="relative flex items-center gap-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-headset"
              >
                <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
                <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
              </svg>
              <span className="hidden sm:inline">Hỗ trợ khách hàng</span>
            </span>
          </Link>
        </ul>{" "}
        <div
          className={`relative h-full w-fit sm:w-[250px] px-5 flex justify-center items-center cursor-pointer hover:bg-[#CC8C08] hover:text-white`}
          onClick={handleChatWithAdmin}
        >
          <span className="relative flex items-center gap-x-2 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shield-user"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              <path d="M6.376 18.91a6 6 0 0 1 11.249.003" />
              <circle cx="12" cy="11" r="4" />
            </svg>
            <span className="hidden sm:inline">Liên hệ quản trị viên</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
