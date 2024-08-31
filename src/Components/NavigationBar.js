// import hooks
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// import icons
import { TiThMenu } from "react-icons/ti";
import { FaUser } from "react-icons/fa";

// import components
import { UserBox } from "./Middle";

// import contexts
import { AppContext } from "../Context/AppContext";

// import images
import logo from "../images/logo.png";
import user_icon from "../images/user_icon.png";

const NavigationBar = () => {
  const { sideBarOpen, setSideBarOpen, openUserBox, setOpenUserBox, session } =
    useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const handleSearch = () => {
    if (search !== "") {
      navigate(`/real+estate/search+result/query=?${search}`, {
        state: search,
      });
    }
  };
  return (
    location.pathname !== "/staff/login" && (
      <div className="sticky top-0 w-full px-5 md:px-10 pb-5 sm:py-1 z-40 bg-transparent flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          {/* Logo  */}
          <Link to="/" className="flex gap-x-2 ">
            <span className="w-[100px]">
              <img src={logo} alt="logo" />
            </span>
          </Link>

          {/* Search input */}
          <div className="hidden sm:block">
            <input
              type="text"
              name="query"
              id="query"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tên tài sản..."
              className="px-3 border-[2px] rounded-md border-solid border-slate-400 focus:outline-none focus:border-2 focus:border-solid focus:border-[#0B60B0] w-[250px] h-[40px]"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="ml-1 text-white rounded-md bg-[#0B60B0] h-[40px] px-5 hover:opacity-80"
            >
              Tìm kiếm
            </button>
          </div>

          {/* User icons  */}

          <div className="relative flex items-center gap-x-4 md:gap-x-4">
            {localStorage.getItem("userInfo") && session ? (
              <div className="flex justify-between items-center gap-x-4">
                {session ? (
                  <span className="font-bold">{session.username}</span>
                ) : (
                  "Không xác định"
                )}
                <div
                  onClick={() => {
                    setOpenUserBox(!openUserBox);
                  }}
                  className="w-[50px] h-[50px] rounded-full overflow-hidden border-[4px] border-solid border-slate-200 cursor-pointer"
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
                  className="h-[40px] text-lg font-bold px-5 border-[#0B60B0] border-[2px] border-solid flex justify-center items-center rounded-xl"
                >
                  Đăng ký
                </Link>
                <Link
                  to="/real+estate/signin"
                  className="h-[40px] text-lg font-bold px-5 bg-[#0b60b0] border-[2px] border-solid flex justify-center items-center rounded-xl text-white"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
            <button
              className="block lg:hidden"
              onClick={() => {
                setSideBarOpen(!sideBarOpen);
              }}
            >
              <TiThMenu className="text-2xl text-[#0B60B0]" />
            </button>
          </div>
        </div>

        {/* Search bar for mobile devices */}
        <div className="flex sm:hidden justify-center">
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
              className="px-3 border-[2px] border-solid border-slate-400 focus:outline-none focus:border-2 focus:border-solid focus:border-[#0B60B0] w-[200px] h-[40px]"
            />
            <button
              type="submit"
              className="ml-1 text-white bg-[#0B60B0] h-[40px] px-5 hover:opacity-80"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        <UserBox />
      </div>
    )
  );
};

export default NavigationBar;

//THIS FILE WAS BEING OPENED
