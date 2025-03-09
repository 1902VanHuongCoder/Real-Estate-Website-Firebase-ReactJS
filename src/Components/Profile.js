// 📦 Import hooks
import React, { useContext, useEffect } from "react";

// 📦 Import icons
import { FaLocationDot } from "react-icons/fa6";
import Transitions from "./Partials/Transition";

// 🌐 Import contexts
import { AppContext } from "../Context/AppContext";

// 📷 Import images
import defaultBackground from "../images/buiding.jpg";
import defaultAvatar from "../images/user_icon.png";

// 📦 Import components
import { Link } from "react-router-dom";

// 🏷️ Profile component
const Profile = () => {
  const { session } = useContext(AppContext);

  // 📝 Redirect to sign-in if no user info
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      window.location.href = "/real+estate/signin";
    }
  }, []);

  return (
    <Transitions>
      <div className="w-full h-fit">
        {/* Background */}
        <div
          className="h-[400px] w-full bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url("${
              session && session.backgroundURL !== ""
                ? session.backgroundURL
                : defaultBackground
            }")`,
          }}
        ></div>

        <div className="relative h-fit pt-[300px] sm:pt-[280px] lg:pt-[250px]">
          {/* User info */}
          <div className="absolute -top-[200px] left-[50%] translate-x-[-50%] w-[90%] sm:w-2/5 h-fit p-5 bg-white rounded-md shadow-md flex flex-col gap-y-1 items-center justify-center">
            <div className="w-fit h-fit border-[5px] border-solid border-[#CC8C08] rounded-full">
              <div
                className="w-[120px] h-[120px] rounded-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("${
                    session && session.photoURL !== ""
                      ? session.photoURL
                      : defaultAvatar
                  }")`,
                }}
              ></div>
            </div>
            <h1 className="mt-5 text-2xl sm:text-4xl font-medium">
              {session ? session.username : "Lỗi hiển thị"}
            </h1>
            <p className="text-base sm:text-lg text-slate-500 mt-5 flex gap-x-2 items-center">
              <span className="text-red-500 hidden sm:block">
                <FaLocationDot />
              </span>
              <span className="text-center">
                {session && session.address !== ""
                  ? session.address
                  : "Chưa cập nhật thông tin"}
              </span>
            </p>
            <p className="text-lg text-slate-500 mt-5">
              <span className="">Điện thoại: </span>
              <span>
                {session && session.phoneNumber
                  ? session.phoneNumber
                  : "Chưa cập nhật thông tin"}
              </span>
            </p>
            <div className="flex justify-between w-full px-0 sm:px-10 mt-5">
              <p className="flex flex-col items-center sm:flex-row gap-2">
                <span className="italic">Ngày cập nhật: </span>
                <span>
                  {session && session.update_at !== ""
                    ? session.updatedAt
                    : "Không xác định"}
                </span>
              </p>
              <p className="flex flex-col items-center sm:flex-row gap-2">
                <span className="italic"> Ngày gia nhập: </span>
                <span>
                  {session && session.create_at !== ""
                    ? session.createdAt
                    : "Không xác định"}
                </span>
              </p>
            </div>
          </div>

          {/* Navigation options */}
          <div className="w-full h-fit flex justify-end gap-x-2 px-5 pb-5">
            <Link
              to="/"
              className="px-4 py-2 bg-[#CC8C08] text-white font-medium text-lg rounded-md"
            >
              Trang chủ
            </Link>
            <Link
              to="/real+estate/update+profile"
              className="px-4 py-2 bg-[#CC8C08] text-white font-medium text-lg rounded-md"
            >
              Sửa hồ sơ
            </Link>
          </div>
        </div>
      </div>
    </Transitions>
  );
};

export default Profile;
