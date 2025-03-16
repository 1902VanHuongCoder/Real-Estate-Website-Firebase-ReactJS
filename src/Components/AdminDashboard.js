// 📦 Import hooks
import React, { useContext } from "react";

// 📷 Import images
import building from "../images/buiding.jpg";
import companyLogo from "../images/logo.png";

// 🌐 Import contexts
import { AppContext } from "../Context/AppContext";

import { Link, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// 🏷️ AdminDashboard component
const AdminDashboard = () => {
  const { showCongratulation, setShowCongratulation } = useContext(AppContext);

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
            <p className="text-lg  hidden sm:block">
              Uy tín - Tận tâm - Hiệu quả
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="relative mt-5 w-full overflow-x-scroll sm:overflow-hidden h-[60px] border-y-[1px] border-solid border-slate-200">
        <AnimatePresence mode="wait">
          <ul className="flex w-full h-full text-lg">
            <Link
              to="/admin"
              className={`relative px-5 flex justify-center items-center ${
                location.pathname === "/admin" ? "bg-[#CC8C08] text-white" : ""
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
                  className="lucide lucide-box"
                >
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
                <span className="hidden sm:inline">Tổng quan</span>
              </span>
            </Link>
            <Link
              to="/admin/list+of+posts"
              className={`relative px-5 flex justify-center items-center ${
                location.pathname === "/admin/list+of+posts"
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
                  className="lucide lucide-school"
                >
                  <path d="M14 22v-4a2 2 0 1 0-4 0v4" />
                  <path d="m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10" />
                  <path d="M18 5v17" />
                  <path d="m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6" />
                  <path d="M6 5v17" />
                  <circle cx="12" cy="9" r="2" />
                </svg>
                <span className="hidden sm:inline">Tất cả bài đăng</span>
              </span>
            </Link>
            <Link
              to="/admin/list+of+user+accounts"
              className={`relative px-5 flex justify-center items-center ${
                location.pathname === "/admin/list+of+user+accounts"
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
                  className="lucide lucide-contact"
                >
                  <path d="M16 2v2" />
                  <path d="M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                  <path d="M8 2v2" />
                  <circle cx="12" cy="11" r="3" />
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                </svg>
                <span className="hidden sm:inline">Tất cả người dùng</span>
              </span>
            </Link>
            <Link
              to="/admin/list+of+staff+accounts"
              className={`relative px-5 flex justify-center items-center ${
                location.pathname === "/admin/list+of+staff+accounts"
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
                  className="lucide lucide-handshake"
                >
                  <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                  <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                  <path d="m21 3 1 11h-2" />
                  <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                  <path d="M3 4h8" />
                </svg>
                <span className="hidden sm:inline">Tất cả nhân viên</span>
              </span>
            </Link>
            <Link
              to="/admin/add+staff"
              className={`relative px-5 flex justify-center items-center ${
                location.pathname === "/admin/add+staff"
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
                  className="lucide lucide-file-plus"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M9 15h6" />
                  <path d="M12 18v-6" />
                </svg>
                <span className="hidden sm:inline">Thêm nhân viên</span>
              </span>
            </Link>
          </ul>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
