// 📦 Import hooks
import React, { useContext } from "react";

// 📦 Import icons
import {
  FaBuilding,
  FaLocationDot,
  FaRulerCombined,
  FaRulerHorizontal,
} from "react-icons/fa6";
import { GiMultiDirections } from "react-icons/gi";
import { MdBedroomParent } from "react-icons/md";
import { PiToiletFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

// 📷 Import images
import label from "../images/label.png";

// 🏷️ OptionResults component
const OptionResults = () => {
  const { setRealEstateDetail, news } = useContext(AppContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  const queryResult = [];
  const keyWordsArray = state.split(" ");

  // 📝 Filter news based on keywords
  for (let j = 0; j < news.length; j++) {
    const typeOfPropertyLowerCase = news[j].typeOfProperty.toLowerCase();
    const keyWord = state.substring(4).toLowerCase();
    if (typeOfPropertyLowerCase === keyWord) {
      queryResult.push(news[j]);
      break;
    }

    for (let i = 0; i < keyWordsArray.length; i++) {
      let postTitle = news[j].postTitle.toLowerCase();
      let keyW = keyWordsArray[i].toLowerCase();
      if (postTitle.includes(keyW)) {
        queryResult.push(news[j]);
        break;
      }
    }
  }

  // 📝 Handle view details
  const handleViewDetails = (postData) => {
    setRealEstateDetail(postData);
    navigate("/details");
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full h-fit p-5">
      <h1 className="pl-4 text-xl font-medium border-l-[5px] border-l-solid border-l-[#CC8C08]">
        Kết quả tìm kiếm cho cho từ khóa "{state}"
      </h1>
      {queryResult.length > 0 ? (
        <div className="w-full mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {queryResult.map((element, index) => (
            <div
              key={index}
              className="w-full mt-5 border-[1px] border-solid border-slate-200 h-fit rounded-md"
            >
              <div
                className="relative w-full h-[350px] bg-cover bg-center bg-no-repeat rounded-t-md"
                style={{
                  backgroundImage: `url("${element.titleImageURL.imageURL}")`,
                }}
              >
                <div
                  className="absolute top-5 -left-1 w-fit h-[50px] bg-cover bg-right bg-no-repeat text-white text-lg flex pl-4 pr-6 items-center"
                  style={{ backgroundImage: `url("${label}")` }}
                >
                  {element.price}
                </div>
              </div>
              <div className="flex flex-col gap-y-2 p-2">
                <h3 className="font-medium text-lg">{element.postTitle}</h3>
                <p className="flex items-center gap-x-1 text-base">
                  <span className="text-lg text-red-600">
                    <FaLocationDot />
                  </span>
                  {element.address}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:grid-cols-4 lg:gap-x-5 justify-evenly">
                  <div className="flex items-center gap-x-2">
                    <span>
                      <FaRulerCombined />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Diện tích: </span>
                      <span>
                        {element.acreage} m<sup>2</sup>
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span>
                      <GiMultiDirections />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Hướng: </span>
                      <span>{element.direction}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span>
                      <FaBuilding />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Số tầng: </span>
                      <span>{element.floors}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span>
                      <FaRulerHorizontal />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Mặt tiền: </span>
                      <span>{element.facade}m</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span>
                      <MdBedroomParent />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Phòng ngủ: </span>
                      <span>{element.bedrooms}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span>
                      <PiToiletFill />
                    </span>
                    <span className="flex gap-x-1 items-center">
                      <span className="opacity-60">Số toilet: </span>
                      <span>{element.toilets}</span>
                    </span>
                  </div>
                </div>
                <div>Đã được đăng vào ngày: {element.createdAt}</div>
                <button
                  onClick={() => handleViewDetails(element)}
                  className="w-[100px] h-[40px] border-[2px] border-solid border-[#CC8C08] hover:bg-[#CC8C08] hover:text-white rounded-md"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full border-dashed border-[2px] border-slate-500 mt-[21px] flex justify-center items-center h-[600px] text-lg">
          Không có kết quả phù hợp
        </div>
      )}
    </div>
  );
};

export default OptionResults;
