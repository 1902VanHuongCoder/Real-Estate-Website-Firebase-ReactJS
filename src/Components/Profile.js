// import hooks
import React, { useContext, useEffect } from "react";

//import icons
import { FaLocationDot } from "react-icons/fa6";
import Transitions from "./Partials/Transition";

//import context
import { AppContext } from "../Context/AppContext";

//import images
import defaultBackground from "../images/buiding.jpg";
import defaultAvatar from "../images/user_icon.png";

//import components
import { Link } from "react-router-dom";

const Profile = () => {
  const { session } = useContext(AppContext);
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      window.location.href = "/real+estate/signin";
    }
  }, []);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <Transitions>
      <div className="w-full h-fit">
        {/* background  */}
        <div
          className="h-[650px] w-full bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url("${
              session && session.backgroundURL !== ""
                ? session.backgroundURL
                : defaultBackground
            }")`,
          }}
        ></div>

        <div className="relative h-fit pt-[300px] sm:pt-[280px] lg:pt-[250px]">
          {/* user info */}
          <div className="absolute -top-[200px] left-[50%] translate-x-[-50%] w-[90%] sm:w-3/5 h-fit p-5 bg-white rounded-md shadow-md flex flex-col gap-y-2 items-center justify-center">
            <div className="w-fit h-fit border-[5px] border-solid border-slate-300 rounded-full">
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
            <h1 className="mt-5 text-4xl font-medium">
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
              <span className="text-base">Điện thoại: </span>
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

          {/* navigation options */}
          <div className="w-full h-fit flex gap-x-2 px-5 pb-5 border-b-[1px] border-b-solid border-b-slate-200">
            <Link
              to="/"
              className="h-[60px] border-[1px] border-solid border-slate-400 px-5 py-3 bg-[#40A2D8] text-white font-medium text-lg"
            >
              Trang chủ
            </Link>
            <Link
              to="/real+estate/update+profile"
              className="h-[60px] border-[1px] border-solid border-slate-400 px-5 py-3 bg-[#40A2D8] text-white font-medium text-lg"
            >
              Sửa hồ sơ
            </Link>
          </div>

          {/* Posts list are waiting accepting */}
          {/* <div className="p-5">
            <p className="flex gap-x-1 items-center text-3xl pb-10 pt-5">
              <span className="opacity-80 flex justify-center items-center h-[50px]">
                <GoDotFill />
              </span>
              <span className="flex justify-center items-center h-[50px]">
                Danh sách bài đăng
              </span>
            </p>
            <div className="w-full h-fit mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="w-[320px] sm:w-[360px] h-[550px] sm:h-[500px] bg-white rounded-t-md hover:shadow-lg transition-shadow border-[1px] border-solid border-slate-200 overflow-hidden">
                <div
                  className="w-full h-[60%] bg-red-400 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("./images/Nha+Rieng+Image+03.jpg")`,
                  }}
                ></div>
                <div className="py-3 px-2 flex flex-col gap-y-2">
                  <p className="text-xl font-medium">
                    Phân lô ngõ 31 Trần Quốc Hoàn, ô tô vào nhà, 55m2, 5 tầng,
                    10.2 tỷ
                  </p>
                  <div className="text-lg flex gap-x-1">
                    <span className="text-slate-500">Ngày đăng:</span>
                    <span>01/01/2023</span>
                  </div>
                  <div className="flex gap-x-2 mt-5 justify-end">
                    <button className="hover:opacity-80 px-5 py-3 border-[2px] border-solid border-[#0B60B0] font-medium">
                      Cập nhật
                    </button>
                    <button className="hover:opacity-80 px-5 py-3 font-medium bg-red-500 text-white">
                      Xóa bài đăng
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-[320px] sm:w-[360px] h-[550px] sm:h-[500px] bg-white rounded-t-md hover:shadow-lg transition-shadow border-[1px] border-solid border-slate-200 overflow-hidden">
                <div
                  className="w-full h-[60%] bg-red-400 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("./images/Nha+Rieng+Image+02.jpg")`,
                  }}
                ></div>
                <div className="py-3 px-2 flex flex-col gap-y-2">
                  <p className="text-xl font-medium">
                    Phân lô ngõ 31 Trần Quốc Hoàn, ô tô vào nhà, 55m2, 5 tầng,
                    10.2 tỷ
                  </p>
                  <div className="text-lg flex gap-x-1">
                    <span className="text-slate-500">Ngày đăng:</span>
                    <span>01/01/2023</span>
                  </div>
                  <div className="flex gap-x-2 mt-5 justify-end">
                    <button className="hover:opacity-80 px-5 py-3 border-[2px] border-solid border-[#0B60B0] font-medium">
                      Cập nhật
                    </button>
                    <button className="hover:opacity-80 px-5 py-3 font-medium bg-red-500 text-white">
                      Xóa bài đăng
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-[320px] sm:w-[360px] h-[550px] sm:h-[500px] bg-white rounded-t-md hover:shadow-lg transition-shadow border-[1px] border-solid border-slate-200 overflow-hidden">
                <div
                  className="w-full h-[60%] bg-red-400 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("./images/Nha+Rieng+Image+04.jpg")`,
                  }}
                ></div>
                <div className="py-3 px-2 flex flex-col gap-y-2">
                  <p className="text-xl font-medium">
                    Phân lô ngõ 31 Trần Quốc Hoàn, ô tô vào nhà, 55m2, 5 tầng,
                    10.2 tỷ
                  </p>
                  <div className="text-lg flex gap-x-1">
                    <span className="text-slate-500">Ngày đăng:</span>
                    <span>01/01/2023</span>
                  </div>
                  <div className="flex gap-x-2 mt-5 justify-end">
                    <button className="hover:opacity-80 px-5 py-3 border-[2px] border-solid border-[#0B60B0] font-medium">
                      Cập nhật
                    </button>
                    <button className="hover:opacity-80 px-5 py-3 font-medium bg-red-500 text-white">
                      Xóa bài đăng
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-[320px] sm:w-[360px] h-[550px] sm:h-[500px] bg-white rounded-t-md hover:shadow-lg transition-shadow border-[1px] border-solid border-slate-200 overflow-hidden">
                <div
                  className="w-full h-[60%] bg-red-400 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("./images/Nha+Rieng+Image+02.jpg")`,
                  }}
                ></div>
                <div className="py-3 px-2 flex flex-col gap-y-2">
                  <p className="text-xl font-medium">
                    Phân lô ngõ 31 Trần Quốc Hoàn, ô tô vào nhà, 55m2, 5 tầng,
                    10.2 tỷ
                  </p>
                  <div className="text-lg flex gap-x-1">
                    <span className="text-slate-500">Ngày đăng:</span>
                    <span>01/01/2023</span>
                  </div>
                  <div className="flex gap-x-2 mt-5 justify-end">
                    <button className="hover:opacity-80 px-5 py-3 border-[2px] border-solid border-[#0B60B0] font-medium">
                      Cập nhật
                    </button>
                    <button className="hover:opacity-80 px-5 py-3 font-medium bg-red-500 text-white">
                      Xóa bài đăng
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-[320px] sm:w-[360px] h-[550px] sm:h-[500px] bg-white rounded-t-md hover:shadow-lg transition-shadow border-[1px] border-solid border-slate-200 overflow-hidden">
                <div
                  className="w-full h-[60%] bg-red-400 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("./images/Nha+Rieng+Image+01.jpg")`,
                  }}
                ></div>
                <div className="py-3 px-2 flex flex-col gap-y-2">
                  <p className="text-xl font-medium">
                    Phân lô ngõ 31 Trần Quốc Hoàn, ô tô vào nhà, 55m2, 5 tầng,
                    10.2 tỷ
                  </p>
                  <div className="text-lg flex gap-x-1">
                    <span className="text-slate-500">Ngày đăng:</span>
                    <span>01/01/2023</span>
                  </div>
                  <div className="flex gap-x-2 mt-5 justify-end">
                    <button className="hover:opacity-80 px-5 py-3 border-[2px] border-solid border-[#0B60B0] font-medium">
                      Cập nhật
                    </button>
                    <button className="hover:opacity-80 px-5 py-3 font-medium bg-red-500 text-white">
                      Xóa bài đăng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </Transitions>
  );
};

export default Profile;
