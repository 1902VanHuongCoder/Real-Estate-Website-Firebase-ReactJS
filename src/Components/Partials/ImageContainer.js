// import hooks
import React, { useCallback, useContext, useState } from "react";

// import icons
import { MdZoomInMap } from "react-icons/md";
import { FaLightbulb } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

// import contexts
import { AppContext } from "../../Context/AppContext";

// import library
import ImageZoom from "react-image-zooom";
import { wrap } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";

const ImageContainer = (state) => {
  const { setShowImage } = useContext(AppContext);
  const [[page, direction], setPage] = useState([0, 0]);

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

  const imageContainerVariants = {
    enter: {
      scale: 0,
      opacity: 0,
    },
    center: {
      scale: 1,
      opacity: 1,
    },
    exit: {
      scale: 0,
      opacity: 0,
    },
  };
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  // const extractImageIntoArray = useCallback(() => {
  //   const images = [];
  //   if (state) {
  //     images.push(state.titleImageURL.imageURL);
  //     state.besideImageURLs.map((item, i) => images.push(item.imageURL));
  //   }

  //   return images;
  // }, [state]);

  // const images = extractImageIntoArray();
  const images = state.state;
  const imageIndex = wrap(0, images.length, page);

  const handleViewImages = (index) => {
    if (index < page) {
      setPage([index, -1]);
    }
    if (index > page) {
      setPage([index, 1]);
    }
    return;
  };

  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial="enter"
        animate="center"
        exit="exit"
        style={{ transformOrigin: "center" }}
        transition={{ duration: 0.1 }}
        variants={imageContainerVariants}
        className={`fixed top-0 left-0 w-screen h-screen flex flex-col gap-y-5 justify-between py-10 items-center bg-[rgba(0,0,0,.9)] z-50`}
      >
        <div className="h-[50px] sm:h-[60px] w-[90%] sm:w-4/5 lg:w-3/5 flex  justify-between items-center">
          <p className="text-white flex items-center gap-x-2">
            <span>
              <FaLightbulb />
            </span>
            <span>Click on image to zoom</span>
          </p>
          <button
            onClick={() => {
              setShowImage({ show: false, images: [] });
            }}
            className="hover:opacity-80 text-white w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-md bg-[rgba(255,255,255,.2)] flex justify-center items-center text-2xl"
          >
            <MdZoomInMap />
          </button>
        </div>
        <div className="relative w-[90%] sm:w-4/5 lg:w-3/5 h-4/5 flex items-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              className="absolute bg-cover bg-no-repeat bg-center w-full h-fit"
              key={page}
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
            >
              <ImageZoom
                src={images.length > 0 && images[imageIndex]}
                alt="Ảnh chi tiết"
                zoom="200"
                className=""
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className=" w-[90%] sm:w-4/5 lg:w-3/5 h-[80px] flex gap-x-3 overflow-x-auto overflow-y-hidden">
          {images?.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => handleViewImages(index)}
                className="shrink-0 cursor-pointer border-[2px] border-solid border-white hover:opacity-70 h-[70px] w-[100px] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("${item}")` }}
              ></div>
            );
          })}
        </div>

        <div
          onClick={() => paginate(-1)}
          className="absolute left-20 top-[50%] -translate-y-[50%] w-[60px] h-[60px] bg-[rgba(255,255,255,.2)] text-white rounded-full flex justify-center items-center"
        >
          <IoIosArrowBack />
        </div>
        <div
          onClick={() => paginate(1)}
          className="absolute right-20 top-[50%] -translate-y-[50%] w-[60px] h-[60px] bg-[rgba(255,255,255,.2)] text-white rounded-full flex justify-center items-center"
        >
          <IoIosArrowForward />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageContainer;
