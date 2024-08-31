// import hooks
import React, { useCallback, useContext, useState } from "react";
import { useNotification } from "../../Hooks/useNotification";

// import icons
import { GoDotFill } from "react-icons/go";
import { MdBedroomParent, MdOutlineZoomOutMap } from "react-icons/md";
import {
  FaBuilding,
  FaRulerCombined,
  FaRulerHorizontal,
} from "react-icons/fa6";
import { GiMultiDirections } from "react-icons/gi";
import { PiToiletFill } from "react-icons/pi";
import { MdMessage } from "react-icons/md";

import { FaTag } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";

//import context
import { AppContext } from "../../Context/AppContext";

//import library
import { htmlToText } from "html-to-text";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Example = () => {
  const { setShowImage, session } = useContext(AppContext);

  const { state } = useLocation();

  const [[page, direction], setPage] = useState([0, 0]);

  const navigate = useNavigate();

  console.log(session);
  console.log(state);

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const extractImageIntoArray = useCallback(() => {
    const images = [];
    if (state) {
      images.push(state.titleImageURL.imageURL);
      state.besideImageURLs.map((item, i) => images.push(item.imageURL));
    }

    return images;
  }, [state]);

  const images = extractImageIntoArray();

  const handleViewImages = (index) => {
    if (index < page) {
      setPage([index, -1]);
    }
    if (index > page) {
      setPage([index, 1]);
    }
    return;
  };

  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleToMessage = async () => {
      navigate("/chat", {state: state.userId});
  };

  return (
    <div>
      <div className="flex gap-x-5 lg:flex-row flex-col">
        <div className="relative lg:basis-[70%] w-full h-[400px] overflow-hidden">
          <div className="absolute left-0 w-full       h-[50px]   bottom-5    z-40 flex justify-between px-5">
            <div
              onClick={() => {
                setShowImage(true);
              }}
              className="flex justify-center items-center rounded-md hover:opacity-80 cursor-pointer w-[50px] h-[50px] bg-[rgba(0,0,0,.7)] text-white text-2xl"
            >
              <MdOutlineZoomOutMap />
            </div>
            <div className="flex justify-center items-center rounded-md hover:opacity-80 cursor-pointer w-[50px] h-[50px] bg-[rgba(0,0,0,.7)] text-white text-xl">
              {imageIndex + 1}/{images.length}
            </div>
          </div>
          <div className="relative w-full h-full flex justify-center items-center ">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                className="absolute bg-cover bg-no-repeat bg-center w-full h-full"
                key={page}
                style={{ backgroundImage: `url("${images[imageIndex]}")` }}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
              />
            </AnimatePresence>
          </div>
        </div>
        <div className="basis-[25%] w-full h-[400px] overflow-auto">
          <div className="flex flex-row sm:flex-col gap-2">
            {images.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleViewImages(index)}
                  className={`${
                    index === page && "border-[4px] border-solid border-black"
                  } shrink-0 w-full h-[60px] sm:h-[150px] bg-cover bg-center bg-no-repeat`}
                  style={{ backgroundImage: `url("${item}")` }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col">
        <div className="px-5 lg:px-0 lg:pl-5 lg:basis-[70%]">
          <div className="py-5 border-b-[1px] border-b-solid border-b-slate-200">
            <h1 className="text-2xl mb-1 font-medium">{state?.title}</h1>
            <p className="flex items-center gap-x-1">
              <span className="text-red-500">
                <FaMapMarkerAlt />
              </span>
              <span>{state?.address}</span>
            </p>
            <p className="inline-flex items-center gap-x-1 mt-5 bg-green-500 p-4 rounded-md text-white">
              <span className="">
                <FaTag />
              </span>
              <span className="font-medium">
                {state?.stateOfProperty[0] === true &&  "Bài đăng mới"}
                {state?.stateOfProperty[1] === true && "Đang thỏa thuận"}
                {state?.stateOfProperty[2] === true && "Đã hoàn thành giao dịch"}
              </span>
            </p>
          </div>
          <div className="border-b-[1px] border-b-solid border-b-slate-200 py-5 basis-[75%] grid grid-cols-2 sm:grid-cols-3 gap-2 lg:grid-cols-4 lg:gap-x-5 justify-evenly">
            <div className="flex items-center gap-x-2">
              <span>
                <FaRulerCombined />
              </span>
              <span className="flex gap-x-1 items-center">
                <span className="opacity-60">Diện tích: </span>
                <span>
                  {state?.acreage} m<sup>2</sup>
                </span>
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <span>
                <GiMultiDirections />
              </span>
              <span className="flex gap-x-1 items-center">
                <span className="opacity-60">Hướng: </span>
                <span> {state?.direction}</span>
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <span>
                <FaBuilding />
              </span>
              <span className="flex gap-x-1 items-center">
                <span className="opacity-60">Số tầng: </span>
                <span> {state?.floors}</span>
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <span>
                <FaRulerHorizontal />
              </span>
              <span className="flex gap-x-1 items-center">
                <span className="opacity-60">Mặt tiền: </span>
                <span> {state?.facade} m</span>
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <span>
                <MdBedroomParent />
              </span>
              <span className="flex gap-x-1 items-center">
                <span className="opacity-60">Phòng ngủ: </span>
                <span> {state?.bedrooms}</span>
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <span>
                <PiToiletFill />
              </span>
              <span className="flex gap-x-1 items-center">
                <span className="opacity-60">Số toilet: </span>
                <span> {state?.toilets}</span>
              </span>
            </div>
          </div>
          <div className="py-5 border-b-[1px] border-b-solid border-b-slate-200">
            <h2 className="flex items-center gap-x-1 mb-1">
              <span>
                <GoDotFill />
              </span>
              <span>Thông tin mô tả:</span>
            </h2>
            <p className="text-justify">{htmlToText(state?.description)}</p>
          </div>

          <div className="flex gap-x-10 border-b-[1px] border-b-solid border-b-slate-200 py-5">
            <div className="flex flex-col gap-y-1 items-center">
              <span className="opacity-80">Ngày đăng</span>
              <span className="text-lg">{state?.createdAt}</span>
            </div>
            <div className="flex flex-col gap-y-1 items-center">
              <span className="opacity-80">Ngày cập nhật</span>
              <span className="text-lg">{state?.updatedAt}</span>
            </div>
            <div className="flex flex-col gap-y-1 items-center">
              <span className="opacity-80">Hoa hồng</span>
              <span className="text-lg">{state?.commission} %</span>
            </div>
            <div className="flex flex-col gap-y-1 items-center">
              <span className="opacity-80">Mã bài đăng</span>
              <span className="text-lg">{state?.propertyId}</span>
            </div>
          </div>

          <div className="py-5">
            <h2 className="flex items-center gap-x-1 mb-1">
              <span>
                <GoDotFill />
              </span>
              <span>Nhân viên hỗ trợ:</span>
            </h2>
            <p className="text-justify mt-5 font-bold">{state?.username}</p>
          </div>

          <div className="mt-5 w-full h-[50px] bg-[#0b60b0] text-white rounded-md hover:opacity-90">
            {session ? (
              <button
                onClick={handleToMessage}
                className="flex justify-center items-center w-full h-full gap-x-2"
              >
                <MdMessage /> <span>Nhắn tin</span>
              </button>
            ) : (
              <Link to="/real+estate/signin">Đăng nhập ngay</Link>
            )}
          </div>

          {/* <div className="flex gap-y-5 flex-col border-b-[1px] border-b-solid border-b-slate-200 py-5">
            <div className="flex items-center gap-x-2">
              <span>
                <FaTag />
              </span>
              <span>Bình luận</span>
            </div>
            <div className="w-full h-fit bg-slate-100">
              <div>
                <div className="p-5 flex-col items-center gap-2">
                  <div className="flex items-center gap-x-2">
                    <div className="flex justify-center items-center w-[50px] h-[50px] border-[2px] bg-white border-solid rounded-md overflow-hidden border-[#0b60b0]">
                      <div
                        className="w-[90%] h-[90%] p-4 bg-cover bg-no-repeat bg-center"
                        style={{
                          backgroundImage:
                            "url('https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/174965/Originals/meme-la-gi-3.jpg')",
                        }}
                      ></div>
                    </div>
                    <div>
                      <p className="font-bold">Tô Văn Hưởng</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="w-fit h-fit p-2 bg-white rounded-md mt-3 ml-[30px]">
                      <p>
                        {" "}
                        Nếu khách hàng chê bai sản phẩm dự án, bạn sẽ xử lý như
                        thế nào? Và trong trường hợp nào bạn nên từ chối và
                        ngưng theo đuổi khách hàng?
                      </p>
                    </div>
                    <div className="pr-2 opacity-70">10:18 03/04/2024</div>
                  </div>
                </div>
                <div className="pr-5 pb-5 flex-col items-center ml-[48px]">
                  <div className="flex items-center gap-x-2">
                    <div className="flex justify-center items-center w-[50px] h-[50px] border-[2px] bg-white border-solid rounded-md overflow-hidden border-[#0b60b0]">
                      <div
                        className="w-[90%] h-[90%] p-4 bg-cover bg-no-repeat bg-center"
                        style={{
                          backgroundImage:
                            "url('https://static.lag.vn/upload/news/23/10/27/meme-meo-huh-la-gi-tu-dau-ra-2_NPPF.jpg?w=800&encoder=wic&subsampling=444')",
                        }}
                      ></div>
                    </div>
                    <div>
                      <p className="font-bold">Trinh Huy</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="w-fit h-fit p-2 bg-white rounded-md mt-3 ml-[30px]">
                      <p>
                        {" "}
                        Nếu khách hàng chê bai sản phẩm dự án, bạn sẽ xử lý như
                        thế nào? Và trong trường hợp nào bạn nên từ chối và
                        ngưng theo đuổi khách hàng?
                      </p>
                    </div>
                    <div className="pr-2 opacity-70">10:18 03/04/2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-y-5 flex-col border-b-[1px] border-b-solid border-b-slate-200 py-5">
            <div className="flex items-center gap-x-2">
              <span>
                <FaPenNib />
              </span>
              <span>Đặt câu hỏi về bài đăng</span>
            </div>
            <div>
              <textarea
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full min-h-[200px] border-[1px] border-solid border-black p-2"
              ></textarea>
              <div className="flex justify-end mt-5">
                <button
                  disabled={question === ""}
                  onClick={handleToAskCompany}
                  className={`flex items-center gap-x-2 bg-[#0b60b0] py-3 px-10 text-white outline-none disabled:opacity-50`}
                >
                  Gửi <BsSendFill />{" "}
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Example;
