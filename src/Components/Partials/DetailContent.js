// 📦 Import hooks
import React, { useCallback, useContext, useEffect, useState } from "react";

// 📦 Import icons
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
import { FaTag, FaMapMarkerAlt } from "react-icons/fa";

// 🌐 Import contexts
import { AppContext } from "../../Context/AppContext";

// 📦 Import libraries
import { htmlToText } from "html-to-text";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import { Link, useLocation, useNavigate } from "react-router-dom";

// 🔥 Import Firebase
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../FirebaseConfig/firebase"; // Adjust the import based on your project structure

import { createNewChat } from "../../firebase-helpers";

// 🏷️ DetailContent component
const DetailContent = () => {
  const { setShowImage, session } = useContext(AppContext);
  const { state: postId } = useLocation();
  const [[page, direction], setPage] = useState([0, 0]);
  const [postData, setPostData] = useState(null);
  const navigate = useNavigate();

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  // 🔄 Extract images into an array
  const extractImageIntoArray = useCallback(() => {
    const images = [];
    if (postData) {
      images.push(postData.titleImageURL.imageURL);
      postData.besideImageURLs.forEach((item) => images.push(item.imageURL));
    }
    return images;
  }, [postData]);

  const images = extractImageIntoArray();

  // 🔄 Handle to view images
  const handleViewImages = (index) => {
    if (index < page) setPage([index, -1]);
    if (index > page) setPage([index, 1]);
  };

  // 🔄 Wrap the index
  const imageIndex = wrap(0, images.length, page);

  // 🔄 Handle to paginate
  const paginate = (newDirection) =>
    setPage([page + newDirection, newDirection]);

  // 🔄 Handle to start new chat
  const handleStartNewChat = async () => {
    createNewChat(postData, session); // This function is imported from helpers.js
    navigate("/chat", { state: postData.userId });
  };

  // 📥 Fetch post data from Firestore
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        let docRef = doc(db, "houses", postId);
        let docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          docRef = doc(db, "lands", postId);
          docSnap = await getDoc(docRef);
        }

        if (docSnap.exists()) {
          setPostData(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId]);

  return (
    <div className="w-screen min-h-screen">
      <div className="flex gap-x-1 lg:flex-row flex-col">
        <div className="relative lg:basis-[80%] w-full h-[400px] overflow-hidden">
          <div className="absolute left-0 w-full h-[50px] bottom-5 z-40 flex justify-between px-5">
            <div
              onClick={() => setShowImage({ show: true, images: images })} // Open image container
              className="flex justify-center items-center rounded-md hover:opacity-80 cursor-pointer w-[50px] h-[50px] bg-[rgba(0,0,0,.7)] text-white text-2xl"
            >
              <MdOutlineZoomOutMap />
            </div>
            <div className="flex justify-center items-center rounded-md hover:opacity-80 cursor-pointer w-[50px] h-[50px] bg-[rgba(0,0,0,.7)] text-white text-xl">
              {images && isNaN(imageIndex + 1) === false
                ? imageIndex + 1 + "/" + images.length
                : "0/0"}
            </div>
          </div>
          <div className="relative w-full h-full flex justify-center items-center">
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
                  if (swipe < -swipeConfidenceThreshold) paginate(1);
                  else if (swipe > swipeConfidenceThreshold) paginate(-1);
                }}
              />
            </AnimatePresence>
          </div>
        </div>
        <div className="basis-[20%] w-full h-[400px] overflow-auto">
          <div className="flex flex-row sm:flex-col">
            {images.map((item, index) => (
              <div
                key={index}
                onClick={() => handleViewImages(index)}
                className={`${
                  index === page && "border-[4px] border-solid border-[#FDC824]"
                } sm:shrink-0 w-full h-[60px] sm:h-[150px] bg-cover bg-center bg-no-repeat`}
                style={{ backgroundImage: `url("${item}")` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col">
        <div className="px-4 lg:px-0 lg:pl-5 lg:basis-[70%]">
          <div className="py-5 space-y-2 border-b-[1px] border-b-solid border-b-slate-200">
            <h1 className="text-lg sm:text-2xl mb-1 font-medium">
              {postData?.title}
            </h1>
            <p className="flex items-start gap-x-1">
              <span className="text-red-500 hidden sm:block">
                <FaMapMarkerAlt />
              </span>
              <span>{postData?.address}</span>
            </p>
            <div>
              <p className="inline-flex items-center gap-x-2 border-[#EAA613] border-[3px] border-solid text-[#EAA613] p-4 rounded-md">
                <span>
                  <FaTag />
                </span>
                <span className="font-medium">
                  {postData?.stateOfProperty[0] && "Bài đăng mới"}
                  {postData?.stateOfProperty[1] && "Đang thỏa thuận"}
                  {postData?.stateOfProperty[2] && "Đã hoàn thành giao dịch"}
                </span>
              </p>
            </div>
          </div>
          <div className="border-b-[1px] border-b-solid border-b-slate-200 py-5 basis-[75%] grid grid-cols-2 sm:grid-cols-3 gap-2 lg:grid-cols-4 lg:gap-x-5 justify-evenly">
            {postData?.acreage && (
              <div className="flex items-center gap-x-2">
                <span>
                  <FaRulerCombined />
                </span>
                <span className="flex gap-x-1 items-center">
                  <span className="opacity-60">Diện tích: </span>
                  <span>
                    {postData.acreage} m<sup>2</sup>
                  </span>
                </span>
              </div>
            )}
            {postData?.direction && (
              <div className="flex items-center gap-x-2">
                <span>
                  <GiMultiDirections />
                </span>
                <span className="flex gap-x-1 items-center">
                  <span className="opacity-60">Hướng: </span>
                  <span>{postData.direction}</span>
                </span>
              </div>
            )}
            {postData?.floors && (
              <div className="flex items-center gap-x-2">
                <span>
                  <FaBuilding />
                </span>
                <span className="flex gap-x-1 items-center">
                  <span className="opacity-60">Số tầng: </span>
                  <span>{postData.floors}</span>
                </span>
              </div>
            )}
            {postData?.facade && (
              <div className="flex items-center gap-x-2">
                <span>
                  <FaRulerHorizontal />
                </span>
                <span className="flex gap-x-1 items-center">
                  <span className="opacity-60">Mặt tiền: </span>
                  <span>{postData.facade} m</span>
                </span>
              </div>
            )}
            {postData?.bedrooms && (
              <div className="flex items-center gap-x-2">
                <span>
                  <MdBedroomParent />
                </span>
                <span className="flex gap-x-1 items-center">
                  <span className="opacity-60">Phòng ngủ: </span>
                  <span>{postData.bedrooms}</span>
                </span>
              </div>
            )}
            {postData?.toilets && (
              <div className="flex items-center gap-x-2">
                <span>
                  <PiToiletFill />
                </span>
                <span className="flex gap-x-1 items-center">
                  <span className="opacity-60">Số toilet: </span>
                  <span>{postData.toilets}</span>
                </span>
              </div>
            )}
          </div>
          <div className="py-5 border-b-[1px] border-b-solid border-b-slate-200">
            <h2 className="flex items-center gap-x-1 mb-1">
              <span>
                <GoDotFill className="text-[#FDC824]" />
              </span>
              <span>Thông tin mô tả</span>
            </h2>
            <p className="text-justify sm:pl-5 mt-2">
              {htmlToText(postData?.description)}
            </p>
          </div>

          <div className="border-b-[1px] border-b-solid border-b-slate-200 py-5">
            <p className="flex items-center gap-x-1 mb-1">
              {" "}
              <span>
                <GoDotFill className="text-[#FDC824]" />
              </span>
              <span>Thông tin chung</span>
            </p>
            <div className="flex gap-x-10 sm:flex-row mt-2 flex-col items-start sm:items-center gap-y-4 sm:pl-5">
              <div className="flex flex-col gap-y-1 items-start sm:items-center">
                <span className="opacity-80">Ngày đăng</span>
                <span className="text-lg">{postData?.createdAt}</span>
              </div>
              <div className="flex flex-col gap-y-1 items-start sm:items-center">
                <span className="opacity-80">Ngày cập nhật</span>
                <span className="text-lg">{postData?.updatedAt}</span>
              </div>
              <div className="flex flex-col gap-y-1 items-start sm:items-center">
                <span className="opacity-80">Hoa hồng</span>
                <span className="text-lg">{postData?.commission} %</span>
              </div>
              <div className="flex flex-col gap-y-1 items-start sm:items-center">
                <span className="opacity-80">Mã bài đăng</span>
                <span className="text-lg">{postData?.propertyId}</span>
              </div>
            </div>
          </div>

          <div className="py-5">
            <h2 className="flex items-center gap-x-1 mb-1">
              <span>
                <GoDotFill className="text-[#FDC824]" />
              </span>
              <span>Nhân viên hỗ trợ</span>
            </h2>
            <p className="text-justify mt-2 font-bold sm:pl-5">
              {postData?.username}
            </p>
          </div>
          <div className="flex justify-start w-full px-4">
            <div className="mt-5 w-full sm:w-fit sm:px-5 h-[50px] bg-[#CC8C08] text-white rounded-md hover:opacity-90">
              {session ? (
                <button
                  onClick={handleStartNewChat}
                  className="flex justify-center items-center w-full h-full gap-x-2 text-lg"
                >
                  <MdMessage /> <span>NHẮN TIN</span>
                </button>
              ) : (
                <Link to="/real+estate/signin">Đăng nhập ngay</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailContent;
