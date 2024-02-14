// import hooks
import React, { useState } from "react";

//import firebase services
import { storage } from "../../FirebaseConfig/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

//import icons
import { FaCloudUploadAlt } from "react-icons/fa";

const UploadImage = ({  setTitleImageURL, listOfImageURLs, setListOfImageURLs }) => {
  const [percentOfUploadingTitleImage, setPercentOfUploadingTitleImage] =
    useState(0);
  const [percentOfUploadingImagesList, setPercentOfUploadingImagesList] =
    useState(0);
  const [titleImage, setTitleImage] = useState(null); // store url of title image
  const [listOfImages, setListOfImages] = useState({
    imglist: [],
    details: [],
  }); // list of images

  // handle to store local path of image to render for users
  const handleUploadTitleImage = (event) => {
    const url = URL.createObjectURL(event.target.files[0]);
    setTitleImage({ localURL: url, details: event.target.files[0] });
  };

  // handle to store multiple local path of images to render for users
  const handleUploadMultipleImages = (evnt) => {
    const selectedFiles = Array.from(evnt.target.files);
    const listLocalImageURLs = [];
    selectedFiles.map((file) =>
      listLocalImageURLs.push(URL.createObjectURL(file))
    );
    setListOfImages({
      imglist: [...listOfImages.imglist, listLocalImageURLs],
      details: [...listOfImages.details, evnt.target.files[0]],
    });
  };

  // handle to remove list of selected images
  const handleRemoveImage = (url) => {
    const urlArray = listOfImages.imglist.filter((item) => item !== url);
    setListOfImages({ ...listOfImages, imglist: urlArray });
  };

  // handle store title image to storage of firebase service
  const handleUploadTitleImageToStorage = (e) => {
    e.preventDefault();
    if (titleImage.details) {
      const storageRef = ref(
        storage,
        `/propertyImage/${titleImage.details.name}`
      ); // create reference to storage in products folder
      const uploadTask = uploadBytesResumable(storageRef, titleImage.details); // upload image to storage
      uploadTask.on(
        //keep tracking upload process to display nescessary informations
        "state_changed",
        (snapshot) => {
          // return percent of completed upload
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercentOfUploadingTitleImage(percent);
        },
        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setTitleImageURL(url);
          });
        }
      );
    }
  };


  // handle store list of post's images to firebase storage
  const handleUploadMultipleImageToStorage = (e) => {
    e.preventDefault();
    if (listOfImages.details) {
      for (let i = 0; i < listOfImages.details.length; i++) {
        console.log(listOfImages.details.length);
        const storageRef = ref(
          storage,
          `/propertyImage/${listOfImages.details[i].name}`
        ); // create reference to storage in products folder
        const uploadTask = uploadBytesResumable(
          storageRef,
          listOfImages.details[i]
        ); // upload image to storage
        uploadTask.on(
          //keep tracking upload process to display nescessary informations
          "state_changed",
          (snapshot) => {
            // return percent of completed upload
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setPercentOfUploadingImagesList(percent);
          },
          (error) => console.log(error),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              setListOfImageURLs([...listOfImageURLs, url]);
              console.log("URL" + i);
            });
          }
        );
      }
    }
  };

  var calPercentUploadingTitleImage = 100 - percentOfUploadingTitleImage; // calculate percent of uploading title image to firebase storage

  var calPercentOfUploadingImagesList = 100 - percentOfUploadingImagesList;
  return (
    <div className="w-full py-5">
      <p className="border-l-[5px] border-solid border-[#0B60B0] mb-5 text-xl pl-2">
        Chọn hình ảnh
      </p>
      <div>
        <label htmlFor="titleImage" className="text-slate-500">
          Chọn ảnh cho phần tiêu đề
        </label>
        <div className="relative flex p-5 my-5 justify-center items-center w-full sm:w-4/5 min-h-[300px] mx-auto border-[2px] border-dashed border-slate-400">
          {titleImage && (
            <img
              src={titleImage.localURL}
              alt="test"
              className="w-[300px] h-auto"
            />
          )}
          <div className="absolute bottom-0 right-0 px-4 py-2 bg-[rgba(0,0,0,.5)]">
            <label className="flex gap-x-1" htmlFor="titleImage">
              <span className="flex gap-x-1 items-center text-white cursor-pointer hover:opacity-80">
                <span>Tải lên</span>
                <span className="text-xl">
                  <FaCloudUploadAlt />
                </span>{" "}
              </span>
            </label>{" "}
            <input
              type="file"
              className="hidden"
              name="titleImage"
              id="titleImage"
              onChange={handleUploadTitleImage}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-5 sm:flex-row justify-between items-center">
          <button
            onClick={handleUploadTitleImageToStorage}
            type="button"
            className="ml-1 text-white bg-[#0B60B0] h-[40px] px-5 hover:opacity-80 uppercase"
          >
            Xác nhận ảnh chủ đề
          </button>
          {percentOfUploadingTitleImage > 0 && (
            <div className="relative h-[30px] w-[300px] shadow-inner border-[4px] flex justify-center items-center border-slate-200 border-solid overflow-hidden">
              <span className="absolute w-full h-full flex justify-center items-center font-bold z-10">
                {percentOfUploadingTitleImage}%
              </span>
              <div
                className={`absolute -translate-x-[${calPercentUploadingTitleImage}%] transition-transform border-r-[2px] border-r-slate-400 border-r-solid bg-[rgb(11,96,176)] bg-[linear-gradient(50deg,_rgba(11,96,176,1)_16%,_rgba(255,255,255,1)_16%,_rgba(255,255,255,1)_30%,_rgba(11,96,176,1)_30%,_rgba(11,96,176,1)_44%,_rgba(255,255,255,1)_44%,_rgba(255,255,255,1)_58%,_rgba(11,96,176,1)_58%,_rgba(11,96,176,1)_72%,_rgba(255,255,255,1)_72%,_rgba(255,255,255,1)_85%,_rgba(10,95,175,1)_85%,_rgba(11,96,176,1)_96%,_rgba(255,255,255,1)_96%)]
 w-full h-full -z-1`}
              ></div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-10">
        <label htmlFor="listOfImages" className="text-slate-500">
          Chọn các hình ảnh tài sản còn lại
        </label>
        <div className="relative p-5 my-5 flex flex-col gap-y-3 justify-center items-center w-full sm:w-4/5 min-h-[300px] mx-auto border-[2px] border-dashed border-slate-400">
          <div className="flex flex-wrap w-full justify-center gap-2">
            {listOfImages.imglist?.map((url, index) => {
              return (
                <div
                  key={index}
                  className="relative w-[200px] h-auto shrink-0 grow-0 "
                >
                  <img
                    src={url}
                    className="w-full h-auto border-[4px] border-solid boder-slate-400"
                    alt="test"
                  />
                  <button
                    onClick={() => {
                      handleRemoveImage(url);
                    }}
                    className="absolute -right-[5px] -top-[10px] w-[20px] h-[20px] bg-red-500 text-white rounded-full text-sm"
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-0 right-0 px-4 py-2 bg-[rgba(0,0,0,.5)]">
            <label className="flex gap-x-1" htmlFor="listOfImages">
              <span className="flex gap-x-1 items-center text-white">
                <span>Tải lên</span>
                <span className="text-xl">
                  <FaCloudUploadAlt />
                </span>{" "}
              </span>
            </label>{" "}
            <input
              type="file"
              className="hidden"
              name="listOfImages"
              id="listOfImages"
              multiple
              onChange={handleUploadMultipleImages}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-5 sm:flex-row justify-between items-center">
          <button
            type="button"
            onClick={handleUploadMultipleImageToStorage}
            className="ml-1 text-white bg-[#0B60B0] h-[40px] px-5 hover:opacity-80 uppercase"
          >
            Xác nhận ảnh còn lại
          </button>
            {percentOfUploadingImagesList > 0 && (
              <div className="relative h-[30px] w-[300px] shadow-inner border-[4px] flex justify-center items-center border-slate-200 border-solid overflow-hidden">
                <span className="absolute w-full h-full flex justify-center items-center font-bold z-10">
                  {percentOfUploadingImagesList}%
                </span>
                <div
                  className={`absolute -translate-x-[${calPercentOfUploadingImagesList}] transition-transform border-r-[2px] border-r-slate-400 border-r-solid bg-[rgb(11,96,176)] bg-[linear-gradient(50deg,_rgba(11,96,176,1)_16%,_rgba(255,255,255,1)_16%,_rgba(255,255,255,1)_30%,_rgba(11,96,176,1)_30%,_rgba(11,96,176,1)_44%,_rgba(255,255,255,1)_44%,_rgba(255,255,255,1)_58%,_rgba(11,96,176,1)_58%,_rgba(11,96,176,1)_72%,_rgba(255,255,255,1)_72%,_rgba(255,255,255,1)_85%,_rgba(10,95,175,1)_85%,_rgba(11,96,176,1)_96%,_rgba(255,255,255,1)_96%)]
    w-full h-full -z-1`}
                ></div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
