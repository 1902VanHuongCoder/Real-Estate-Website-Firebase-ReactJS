// 📦 Import hooks
import React, { useContext, useState } from "react";

// 📦 Import icons
import { FaLocationDot } from "react-icons/fa6";
import { FaRulerCombined, FaRulerHorizontal } from "react-icons/fa6";
import { GiMultiDirections } from "react-icons/gi";
import { FaBuilding } from "react-icons/fa";
import { MdBedroomParent } from "react-icons/md";
import { PiToiletFill } from "react-icons/pi";

// 🌐 Import contexts
import { AppContext } from "../Context/AppContext";

// 📦 Import libraries
import { useNavigate } from "react-router-dom";

// 📦 Import images
import label from "../images/label.png";

// 🏷️ News component
const News = () => {
  const { postsWasFiltered } = useContext(AppContext);
  const navigate = useNavigate();

  // 📝 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // 📝 Handle view details
  const handleViewDetails = (postData) => {
    navigate("/details", { state: postData.id });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 📝 Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = postsWasFiltered.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  // 📝 Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="lg:basis-[70%] h-fit w-full sm:pr-5 lg:pr-10 pt-10 sm:pt-14">
      <h2 className="text-lg sm:text-2xl border-l-[6px] border-l-solid border-l-[#CC8C08] pl-3">
        Nhà đất nổi bật
      </h2>

      {/* 📰 News components */}
      {currentPosts.length > 0 ? (
        currentPosts.map((item, index) => (
          <div
            key={index}
            className="w-full mt-5 border-[1px] border-solid border-slate-200 h-fit"
          >
            <div
              className="relative w-full h-[400px] bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${item.titleImageURL?.imageURL || ""}")`,
              }}
            >
              {item.price && (
                <div className="absolute top-5 w-fit h-[50px] bg-cover bg-right bg-no-repeat text-white text-lg flex pl-4 pr-6 items-center">
                  <img
                    src={label}
                    alt="label"
                    className="w-auto h-[50px] absolute top-0 -left-1 -z-1"
                  />
                  <span className="relative top-0 -left-1 bg-yello-200">
                    {item.price} {item.unit === "million" ? "triệu" : "tỷ"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-2 p-2">
              {item.title && (
                <h3 className="font-medium text-lg">{item.title}</h3>
              )}
              {item.address && (
                <p className="flex items-center gap-x-1 text-base">
                  <span className="text-lg text-red-600">
                    <FaLocationDot />
                  </span>
                  {item.address}
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:grid-cols-4 lg:gap-x-5 justify-evenly">
                {item.acreage && item.acreage !== 0 && (
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
                )}
                {item.direction && (
                  <div className="flex items-center gap-x-2">
                    <span>
                      <GiMultiDirections />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Hướng: </span>
                      <span>{item.direction}</span>
                    </span>
                  </div>
                )}
                {item.floors && item.floors !== 0 && (
                  <div className="flex items-center gap-x-2">
                    <span>
                      <FaBuilding />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Số tầng: </span>
                      <span>{item.floors}</span>
                    </span>
                  </div>
                )}
                {item.facade && item.facade !== 0 && (
                  <div className="flex items-center gap-x-2">
                    <span>
                      <FaRulerHorizontal />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Mặt tiền: </span>
                      <span>{item.facade} m</span>
                    </span>
                  </div>
                )}
                {item.bedrooms && item.bedrooms !== 0 && (
                  <div className="flex items-center gap-x-2">
                    <span>
                      <MdBedroomParent />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Phòng ngủ: </span>
                      <span>{item.bedrooms}</span>
                    </span>
                  </div>
                )}
                {item.toilets && item.toilets !== 0 && (
                  <div className="flex items-center gap-x-2">
                    <span>
                      <PiToiletFill />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Số toilet: </span>
                      <span>{item.toilets}</span>
                    </span>
                  </div>
                )}
              </div>
              {item.createdAt && (
                <div>Đã được đăng vào ngày: {item.createdAt}</div>
              )}
              <button
                onClick={() => handleViewDetails(item)}
                className="w-[100px] h-[40px] border-[2px] border-solid border-[#CC8C08] hover:bg-[#CC8C08] hover:text-white self-end rounded-md"
              >
                Chi tiết
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full border-dashed border-[2px] border-slate-500 mt-[21px] flex justify-center items-center h-[200px] text-[20px]">
          Không có dữ liệu
        </div>
      )}

      {/* 📄 Pagination */}
      <div className="flex justify-center mt-5">
        {Array.from(
          { length: Math.ceil(postsWasFiltered.length / postsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 mx-1 border rounded ${
                currentPage === i + 1
                  ? "bg-[#CC8C08] text-white"
                  : "bg-white text-[#CC8C08]"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default News;
