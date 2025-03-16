// 📦 Import hooks
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// 📦 Import icons
import { TiThMenu } from "react-icons/ti";
import { FaSearch } from "react-icons/fa";

// 📦 Import components
import { UserBox } from "./Middle";

// 🌐 Import contexts
import { AppContext } from "../Context/AppContext";

// 📷 Import images
import logo from "../images/logo.png";
import user_icon from "../images/user_icon.png";

// 🏷️ NavigationBar component
const NavigationBar = () => {
  const { sideBarOpen, setSideBarOpen, openUserBox, setOpenUserBox, session } =
    useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  // 📝 Handle search
  const handleSearch = () => {
    if (search !== "") {
      navigate(`/real+estate/search+result/query=?${search}`, {
        state: search,
      });
    }
  };

  return (
    location.pathname !== "/staff/login" && (
      <div className="sticky top-0 w-full z-40 flex flex-col gap-y-4 bg-[#CC8C08] py-2 px-4 shadow-md font-roboto">
        <div className="flex justify-between items-center">
          {/* 🔍 Search input and icon for mobile */}
          <div className="flex items-center gap-x-2 lg:hidden flex-1 sm:flex-none pr-6">
            <input
              type="text"
              name="phoneQuery"
              id="phoneQuery"
              placeholder="Tìm kiếm tài sản..."
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 sm:flex-none px-3 rounded-md border-[2px] border-solid border-[#FEFFAF] focus:outline-none focus:border-2 focus:border-solid focus:border-[#CC8C08] w-full h-[40px]"
            />
            <button onClick={handleSearch}>
              <FaSearch className="text-2xl text-white" />
            </button>
          </div>

          {/* 🖼️ Logo (hidden on mobile) */}
          <Link
            to={
              session && session.role === "admin"
                ? "/admin"
                : session && session.role === "staff"
                ? "/staff/list+posts+of+staff"
                : "/"
            }
            className="hidden sm:flex gap-x-2"
          >
            <span className="w-[40px] h-[40px] rounded-full overflow-hidden">
              <img src={logo} alt="logo" />
            </span>
          </Link>

          {/* 🔍 Search input for desktop */}
          <div className="hidden sm:block w-[60%]">
            <input
              type="text"
              name="query"
              id="query"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm tài sản..."
              className="w-[70%] px-3 rounded-md focus:outline-none focus:border-2 focus:border-solid focus:border-[#FFF46A] h-[40px]"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={search === "" ? true : false}
              className="ml-1 text-black rounded-md bg-[#FFF46A] h-[40px] px-5 hover:opacity-80 disabled:opacity-50"
            >
              Tìm kiếm
            </button>
          </div>

          {/* 👤 User icons */}
          <div className="relative flex items-center gap-x-4 md:gap-x-4">
            {localStorage.getItem("userInfo") && session ? (
              <div className="flex justify-between items-center gap-x-4 text-white">
                {session ? (
                  <span className="hidden sm:block font-bold">
                    {session.username}
                  </span>
                ) : (
                  "Không xác định"
                )}
                <div
                  onClick={() => {
                    setOpenUserBox(!openUserBox);
                  }}
                  className="w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer"
                >
                  <img
                    src={
                      session && session.photoURL !== ""
                        ? session.photoURL
                        : user_icon
                    }
                    alt="user_avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-x-2">
                <Link
                  to="/real+estate/signup"
                  className="h-[40px] text-lg font-bold px-5 border-[#CC8C08] border-[2px] border-solid flex justify-center items-center rounded-xl"
                >
                  Đăng ký
                </Link>
                <Link
                  to="/real+estate/signin"
                  className="h-[40px] text-lg font-bold px-5 bg-[#CC8C08] border-[2px] border-solid flex justify-center items-center rounded-xl text-white"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 🔍 Search bar for mobile devices
        <div className="sm:flex hidden justify-center">
          <form
            onSubmit={handleSearch}
            action="/real+estate/search+result/"
            method="GET"
          >
            <input
              type="text"
              name="phoneQuery"
              id="phoneQuery"
              placeholder="Tên tài sản..."
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 rounded-md border-[2px] border-solid border-[#FEFFAF] focus:outline-none focus:border-2 focus:border-solid focus:border-[#CC8C08] w-[200px] h-[40px]"
            />
            <button
              type="submit"
              className="ml-1 text-black rounded-md bg-[#FFF46A] h-[40px] px-5 hover:opacity-80"
            >
              Tìm kiếm
            </button>
          </form>
        </div> */}

        <UserBox />
      </div>
    )
  );
};

export default NavigationBar;
