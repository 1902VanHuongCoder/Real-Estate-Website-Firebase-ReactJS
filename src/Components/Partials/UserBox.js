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
            <IoHomeOutline /> Trang chủ
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
            <CiUser /> Hồ sơ của bạn
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
            <LuUserCog /> Cập nhật hồ sơ
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
              <MdMessage /> Nhắn tin
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
            <CiLogout /> Đăng xuất
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
