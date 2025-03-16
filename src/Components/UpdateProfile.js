// 📦 Import hooks
import React, { useContext, useEffect, useState } from "react";
import { useNotification } from "../Hooks/useNotification";

// 📦 Import icons
import { LuPencilLine } from "react-icons/lu";
import { FaCamera } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";

// 📦 Import packages
import { useForm } from "react-hook-form";
import Transitions from "./Partials/Transition";

// 📷 Import images
import defaultBackground from "../images/buiding.jpg";
import defaultAvatar from "../images/user_icon.png";
import flagIcon from "../images/vn_flag_icon.png";

// 🌐 Import contexts
import { AppContext } from "../Context/AppContext";

// 🔥 Import Firebase services
import { db, storage } from "../FirebaseConfig/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// 🏷️ UpdateProfile component
const UpdateProfile = () => {
  const [background, setBackground] = useState({
    localURL: null,
    details: null,
  }); // store background url

  const [userAvatar, setUserAvatar] = useState({
    localURL: null,
    details: null,
  }); // store user avatar url

  const { session, setShowSpinner, setSession } = useContext(AppContext);

  const [handleShowNotification] = useNotification();

  const {
    register,
    handleSubmit,
    getValues,
    getFieldState,
    formState: { errors },
  } = useForm();

  // 📦 Import hooks
  const navigate = useNavigate();

  // 📝 Handle to preview background image when user uploads their image
  const handleUploadBackground = (event) => {
    if (event.target.files.length > 0) {
      let url = URL.createObjectURL(event.target.files[0]);
      setBackground({ localURL: url, details: event.target.files[0] });
    }
    return;
  };

  // 📝 Handle to preview user avatar when user uploads their avatar
  const handleUploadUserAvatar = (event) => {
    if (event.target.files.length > 0) {
      let url = URL.createObjectURL(event.target.files[0]);
      setUserAvatar({ localURL: url, details: event.target.files[0] });
    }
    return;
  };

  // 📝 Update session
  const updateSession = async (userId) => {
    const userAccountRef = collection(db, "user_accounts"); // reference to user accounts in database
    const q = query(userAccountRef, where("userId", "==", userId)); // query whether this email had existed in database
    const result = await getDocs(q); // the query command will return a document list that equal to email
    result.docs.forEach((doc) => {
      const data = { ...doc.data(), id: doc.id };
      setSession(data);
    });
    console.log("Update session is successful");
  };

  // 📝 Update user's data
  const handleUpdateUserProfile = async (data) => {
    setShowSpinner(true);
    const userId = localStorage.getItem("userInfo");
    const profileRef = doc(db, "user_accounts", JSON.parse(userId).userId);
    const valuesThatNeedToUpdate = {};
    const getDataFields = getValues(); // get values of all of the input fields

    Object.keys(getDataFields).forEach((key) => {
      // check which field is changed to update
      if (getFieldState(key).isDirty) {
        valuesThatNeedToUpdate[key] = getDataFields[key];
      }
    });

    if (background.details) {
      if (session?.backgroundURL !== "") {
        const desertRef = ref(
          storage,
          `userImages/${session?.backgroundImageName}`
        );
        // Delete the file
        deleteObject(desertRef)
          .then(() => {
            console.log("Background image file was deleted successfully.");
          })
          .catch((error) => {
            console.log("Deleting background image file failed.");
          });
      }

      const storageRef = ref(storage, `userImages/${background.details.name}`);
      const uploadTask = uploadBytesResumable(storageRef, background.details);

      uploadTask.on(
        // keep tracking upload process to display necessary information
        "state_changed",
        (snapshot) => {
          // return percent of completed upload
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(percent);
        },
        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            updateDoc(profileRef, {
              backgroundURL: url,
              backgroundImageName: background.details.name,
            });
            updateSession(session?.userId);
          });
        }
      );
    }

    if (userAvatar.details) {
      if (session?.photoURL !== "") {
        const desertRef = ref(storage, `userImages/${session?.photoName}`);
        // Delete the file
        deleteObject(desertRef)
          .then(() => {
            console.log("File was deleted successfully.");
          })
          .catch((error) => {
            console.log("Deleting file failed.");
          });
      }

      const storageRef = ref(storage, `userImages/${userAvatar.details.name}`);
      const uploadTask = uploadBytesResumable(storageRef, userAvatar.details);

      uploadTask.on(
        // keep tracking upload process to display necessary information
        "state_changed",
        (snapshot) => {
          // return percent of completed upload
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(percent);
        },
        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            updateDoc(profileRef, {
              photoURL: url,
              photoName: userAvatar.details.name,
            });
            updateSession(session?.userId);
          });
        }
      );
    }

    try {
      const date = new Date();
      if (Object.keys(valuesThatNeedToUpdate).length !== 0) {
        updateDoc(profileRef, {
          ...valuesThatNeedToUpdate,
          updatedAt:
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear(),
        }); // update data that have changed
        handleShowNotification("Cập nhật bài đăng thành công", "success");
        setSession({ ...session, ...valuesThatNeedToUpdate });
      }
    } catch (error) {
      console.log("Update profile failed!");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setShowSpinner(false);
  };

  // 📝 Redirect to sign-in if no user info
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      window.location.href = "/real+estate/signin";
    }
  }, []);

  return (
    <Transitions>
      <div className="w-full h-fit">
        <form
          action="/"
          method="POST"
          onSubmit={handleSubmit(handleUpdateUserProfile)}
          className="w-full"
        >
          <div
            className="relative w-full h-[300px] bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${
                background.localURL
                  ? background.localURL
                  : session && session?.backgroundURL !== ""
                  ? session?.backgroundURL
                  : defaultBackground
              })`,
            }}
          >
            <div
              onClick={() => navigate(-1)}
              className="absolute top-5 left-5 text-white cursor-pointer bg-[rgba(0,0,0,.4)] p-2 rounded-full hover:opacity-80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-arrow-left"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M16 12H8" />
                <path d="m12 8-4 4 4 4" />
              </svg>
            </div>
            <label
              htmlFor="background"
              className="absolute top-5 sm:top-[80%] right-4 text-white text-xl flex gap-x-2 items-center px-3 py-2 bg-[rgba(0,0,0,.5)] hover:opacity-80 rounded-md cursor-pointer"
            >
              <span>Cập nhật ảnh nền</span>
              <span>
                <LuPencilLine />
              </span>
            </label>
            <input
              onChange={(event) => handleUploadBackground(event)}
              type="file"
              className="hidden"
              name="background"
              id="background"
            />
          </div>
          <div className="relative w-full h-fit pt-14 sm:pt-10 lg:pt-0">
            {/* User avatar */}
            <div className="absolute left-[50%] sm:left-10 -translate-x-[50%] sm:-translate-x-[0%] -top-[75px] h-fit flex items-center gap-x-2">
              <div
                style={{
                  backgroundImage: `url(${
                    userAvatar.localURL
                      ? userAvatar.localURL
                      : session && session?.photoURL !== ""
                      ? session?.photoURL
                      : defaultAvatar
                  })`,
                }}
                className="border-[4px] border-slate-200 border-solid bg-center bg-cover w-[150px] h-[150px] bg-white rounded-full overflow-hidden flex flex-col justify-end"
              >
                <label
                  htmlFor="user_avatar"
                  className="w-full py-3 bg-[rgba(0,0,0,.5)] text-white hover:opacity-80 cursor-pointer"
                >
                  <span className="w-full flex justify-center items-center">
                    <FaCamera />
                  </span>
                </label>
                <input
                  onChange={(event) => handleUploadUserAvatar(event)}
                  type="file"
                  className="hidden"
                  name="user_avatar"
                  id="user_avatar"
                />
              </div>
            </div>

            <div className="w-full sm:w-3/5 h-fit mx-auto p-5 pt-10 flex flex-col gap-y-4">
              <p className="text-lg sm:uppercase">Cập nhật thông tin</p>
              <div className="flex flex-col gap-y-1">
                <label className="text-slate-500 opacity-80" htmlFor="username">
                  Họ và tên
                </label>
                <input
                  className={`${
                    errors.username ? "border-red-500" : "border-slate-400"
                  } w-full h-[50px] outline-none border-[1px] border-solid pl-3 rounded-md focus:border-[#CC8C08]`}
                  type="text"
                  id="username"
                  name="username"
                  placeholder={
                    session ? session?.username : "Nhập tên của bạn ..."
                  }
                  {...register("username")}
                />
                {errors.username && (
                  <p className="flex items-center gap-x-1 text-red-500">
                    <span>
                      <IoIosWarning />
                    </span>
                    <span>{errors.username.message}</span>
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-y-1">
                <label className="text-slate-500 opacity-80" htmlFor="address">
                  Địa chỉ
                </label>
                <input
                  className={`${
                    errors.address ? "border-red-500" : "border-slate-400"
                  } w-full h-[50px] outline-none border-[1px] border-solid pl-3 rounded-md focus:border-[#CC8C08]`}
                  type="text"
                  id="address"
                  name="address"
                  placeholder={
                    session && session?.address !== ""
                      ? session?.address
                      : "Nhập địa chỉ ..."
                  }
                  {...register("address")}
                />
                {errors.address && (
                  <p className="flex items-center gap-x-1 text-red-500">
                    <span>
                      <IoIosWarning />
                    </span>
                    <span>{errors.address.message}</span>
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  className="text-slate-500 opacity-80"
                  htmlFor="phoneNumber"
                >
                  Số điện thoại
                </label>
                <div className="relative w-full h-fit">
                  <span className="absolute -left-[1px] -top-[1px] w-[100px] h-[52px] flex items-center gap-x-1 pl-2 bg-slate-200 rounded-tl-md rounded-bl-md">
                    <span className="w-[40px] h-[30px] bg-cover bg-center">
                      <img
                        className="w-full h-full"
                        src={flagIcon}
                        alt="vn_flag_icon"
                      />
                    </span>
                    <span className="font-semibold">+84</span>
                  </span>
                  <input
                    className={`${
                      errors.phoneNumber ? "border-red-500" : "border-slate-400"
                    } w-full text-base pl-28 h-[50px] border-[1px] border-solid rounded-md outline-none focus:border-[#CC8C08]`}
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    autoComplete="on"
                    placeholder={
                      session && session?.phoneNumber !== ""
                        ? session?.phoneNumber
                        : "Cập nhật số điện thoại của bạn ..."
                    }
                    {...register("phoneNumber")}
                  />
                </div>

                {errors.phoneNumber && (
                  <p className="flex items-center gap-x-1 text-red-500">
                    <span>
                      <IoIosWarning />
                    </span>
                    <span>{errors.phoneNumber.message}</span>
                  </p>
                )}
              </div>

              {session?.role === "staff" && (
                <div className="flex flex-col gap-y-1">
                  <label className="opacity-80" htmlFor="position">
                    Chức vụ
                  </label>
                  <input
                    className={`${
                      errors.position ? "border-red-500" : "border-slate-400"
                    } w-full h-[50px] outline-none border-[1px] border-solid pl-3 rounded-md`}
                    type="text"
                    id="position"
                    name="position"
                    placeholder={
                      session && session?.position !== ""
                        ? session?.position
                        : "Nhập chức vụ ..."
                    }
                    {...register("position")}
                  />
                  {errors.position && (
                    <p className="flex items-center gap-x-1 text-red-500">
                      <span>
                        <IoIosWarning />
                      </span>
                      <span>{errors.position.message}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  className="text-white bg-[#CC8C08] h-[40px] px-5 hover:opacity-80 rounded-md"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Transitions>
  );
};

export default UpdateProfile;
