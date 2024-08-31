import React, { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";

//import icons
import { FaLocationDot } from "react-icons/fa6";
import { FaBuilding, FaRulerCombined, FaRulerHorizontal } from "react-icons/fa";
import { GiMultiDirections } from "react-icons/gi";
import { MdBedroomParent } from "react-icons/md";
import { PiToiletFill } from "react-icons/pi";

// import libraries
import { useNavigate } from "react-router-dom";

// import components
import Transitions from "./Partials/Transition";

const StaffPost = () => {
  const { session, postsWasFiltered } = useContext(AppContext);
  const navigate = useNavigate();
  const listPostOfStaff = [];

  if (postsWasFiltered) {
    postsWasFiltered.forEach((element) => {
      if (element.username === session.username) {
        listPostOfStaff.push(element);
      }
    });
  }

  const handleUpdatePost = (element) => {
    navigate("/staff/update+post", { state: element });
  };

  return (
    <Transitions>
      <div className="grid grid-cols-2 gap-x-4 mb-10">
        {listPostOfStaff.length === 0 ? (
          <div>Chưa có bài đăng nào.</div>
        ) : (
          listPostOfStaff.map((item, index) => (
            <div
              key={index}
              className="w-full mt-5 border-[1px] border-solid border-slate-200 h-fit hover:shadow-lg transition-shadow"
            >
              <div
                className="relative w-full h-[350px] bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("${item.titleImageURL.imageURL}")`,
                }}
              >
                <div
                  className="absolute top-5 -left-1 w-fit h-[50px] bg-cover bg-right bg-no-repeat text-white text-lg flex pl-4 pr-6 items-center"
                  style={{ backgroundImage: `url("../images/label.png")` }}
                >
                  {item.price} {item.unit === "million" ? "triệu" : "tỷ"}
                </div>
              </div>
              <div className="flex flex-col gap-y-2 p-2">
                <h3 className="font-medium text-lg">{item.title}</h3>
                <p className="flex items-center gap-x-1 text-base">
                  <span className="text-lg text-red-600">
                    <FaLocationDot />
                  </span>
                  {item.address}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:grid-cols-4 lg:gap-x-5 justify-evenly">
                  <div className="flex items-center gap-x-2">
                    <span>
                      <FaRulerCombined />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Diện tích: </span>
                      <span>
                        {item.acreage} m<sup>2</sup>
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span>
                      <GiMultiDirections />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Hướng: </span>
                      <span>{item.direction}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span>
                      <FaBuilding />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Số tầng: </span>
                      <span>{item.floors}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span>
                      <FaRulerHorizontal />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Mặt tiền: </span>
                      <span>{item.facade} m</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span>
                      <MdBedroomParent />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Phòng ngủ: </span>
                      <span>{item.bedrooms}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span>
                      <PiToiletFill />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Số toilet: </span>
                      <span>{item.toilets}</span>
                    </span>
                  </div>
                </div>
                <div>Đã được đăng vào ngày: {item.createdAt}</div>
                <div className="flex justify-end mb-2 px-2">
                  <button
                    onClick={() => handleUpdatePost(item)}
                    className="w-fit px-4 py-2 border-[2px] border-solid border-[#0B60B0] bg-[#0B60B0] text-white"
                  >
                    Sửa thông tin
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        {/* <div className="" key={index}>
        {e.username}
      </div> */}
      </div>
    </Transitions>
  );
};

export default StaffPost;
