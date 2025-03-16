// 📦 Import hooks
import React, { useContext } from "react";

// 📦 Import icons
import { CiLogout, CiLogin, CiUser } from "react-icons/ci";
import { SlNote } from "react-icons/sl";
import { LuUserCog } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { MdMessage } from "react-icons/md";

// 🌐 Import contexts
import { AppContext } from "../../Context/AppContext";

// 📦 Import libraries
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";

// 📷 Import images
import defaultUserAvatar from "../../images/user_icon.png";

// 📦 Import custom hooks
import { useNotification } from "../../Hooks/useNotification";

// 🎨 Animation variants for user box
const userBoxVariants = {
  open: {
    top: "70px",
    right: "1%",
    transition: {
      duration: 0.2,
    },
  },
  close: {
    top: "70px",
    right: "-100%",
    transition: {
      duration: 0.2,
    },
  },
};

// 🏷️ UserBox component
const UserBox = () => {
  const { openUserBox, session, setSession, setShowSpinner, setOpenUserBox } =
    useContext(AppContext);

  const navigate = useNavigate();
  const [handleShowNotification] = useNotification();
  const currentPath = useLocation();

  // 📝 Handle sign out
  const handleSignOut = () => {
    setShowSpinner(true);
    setTimeout(() => {
      setShowSpinner(false);
      localStorage.removeItem("userInfo");
      setSession(null);
      setOpenUserBox(false);
      handleShowNotification("Đăng xuất tài khoản thành công!", "success");
      navigate("/real+estate/signin");
    }, 3000);
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <motion.div
      variants={userBoxVariants}
      animate={openUserBox ? "open" : "close"}
      initial={false}
      className="absolute rounded-xl min-w-[320px] h-fit border-[1px] border-solid border-slate-200 bg-white z-40 shadow-lg"
    >
      <div className="flex gap-x-2 p-5 border-b-[1px] border-solid border-slate-200">
        <div
          style={{
            backgroundImage: `url(${
              session && session.photoURL !== ""
                ? session.photoURL
                : defaultUserAvatar
            })`,
          }}
          className="w-[60px] h-[60px] rounded-full bg-center bg-no-repeat bg-cover border-[4px] border-solid border-[#CC8C08]"
        ></div>
        <div className="self-end flex flex-col gap-y-1">
          <p className="text-2xl font-medium">
            {session ? session.username : "Lỗi hiển thị"}
          </p>
          <p className="text-md opacity-80">
            {session ? session.email : "Lỗi hiển thị"}
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-y-1 px-5 py-5 border-b-[1px] border-solid border-slate-200">
        <Link
          to={
            session && session.role === "admin"
              ? "/admin"
              : session && session.role === "staff"
              ? "/staff/list+posts+of+staff"
              : "/"
          }
        >
          <span
            className={`${
              currentPath.pathname === "/" ? "text-[#CC8C08] font-bold" : ""
            } flex gap-x-2 text-lg cursor-pointer items-center`}
          >
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
              className="lucide lucide-house"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>{" "}
            <span>Trang chủ</span>
          </span>
        </Link>
        <Link to="/real+estate/your+profile">
          <span
            className={`${
              currentPath.pathname === "/real+estate/your+profile"
                ? "text-[#CC8C08] font-bold"
                : ""
            } flex gap-x-2 text-lg cursor-pointer items-center`}
          >
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
              className="lucide lucide-square-user-round"
            >
              <path d="M18 21a6 6 0 0 0-12 0" />
              <circle cx="12" cy="11" r="4" />
              <rect width="18" height="18" x="3" y="3" rx="2" />
            </svg>
            <span>Hồ sơ của bạn</span>
          </span>
        </Link>
        <Link to="/real+estate/update+profile">
          <span
            className={`${
              currentPath.pathname === "/real+estate/update+profile"
                ? "text-[#CC8C08] font-bold"
                : ""
            } flex gap-x-2 text-lg cursor-pointer items-center`}
          >
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
              className="lucide lucide-user-pen"
            >
              <path d="M11.5 15H7a4 4 0 0 0-4 4v2" />
              <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
              <circle cx="10" cy="7" r="4" />
            </svg>
            <span>Cập nhật hồ sơ</span>
          </span>
        </Link>
        {session && session?.role !== "staff" && (
          <Link to="/chat">
            <span
              className={`${
                currentPath.pathname === "/chat"
                  ? "text-[#CC8C08] font-bold"
                  : ""
              } flex gap-x-2 text-lg cursor-pointer items-center`}
            >
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
                className="lucide lucide-message-square-heart"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M14.8 7.5a1.84 1.84 0 0 0-2.6 0l-.2.3-.3-.3a1.84 1.84 0 1 0-2.4 2.8L12 13l2.7-2.7c.9-.9.8-2.1.1-2.8" />
              </svg>{" "}
              <span>Nhắn tin</span>
            </span>
          </Link>
        )}
      </ul>

      <ul className="flex flex-col gap-y-1 px-5 py-5">
        {userInfo ? (
          <li
            onClick={handleSignOut}
            className="flex gap-x-2 text-lg cursor-pointer items-center"
          >
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
              className="lucide lucide-arrow-left-from-line"
            >
              <path d="m9 6-6 6 6 6" />
              <path d="M3 12h14" />
              <path d="M21 19V5" />
            </svg>
            <span>Đăng xuất</span>
          </li>
        ) : (
          <Link
            to="/real+estate/signin"
            className="flex gap-x-2 text-lg cursor-pointer items-center"
          >
            <CiLogin /> Đăng nhập
          </Link>
        )}
      </ul>
    </motion.div>
  );
};

export default UserBox;
