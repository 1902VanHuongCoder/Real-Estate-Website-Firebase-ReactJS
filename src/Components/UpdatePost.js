// 📦 Import hooks
import React, { useState } from "react";
import { useNotification } from "../Hooks/useNotification";

// 📦 Import packages
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// 📦 Import icons
import { IoIosWarning } from "react-icons/io";

// 📦 Import components
import Transitions from "../Components/Partials/Transition";
import UploadImage from "../Components/Partials/UploadImage";
import Editor from "../Components/Editor";

// 🔥 Import firebase services
import { db, storage } from "../FirebaseConfig/firebase";
import { deleteObject, ref } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

// 📦 Import libraries
import { useLocation } from "react-router-dom";

// 🏷️ UpdatePost component
const UpdatePost = () => {
  const { state } = useLocation();

  const [stateOfPost, setStateOfPost] = useState([true, false, false]);
  const [methodWithProperty, setMethodWithProperty] = useState({
    renting: state.renting,
    saling: state.saling,
  }); // renting or saling
  const [isHouse] = useState(state.house); // the property that need to add is home
  const [value, setValueEditor] = useState(state.description); // value of Description Editor
  const [titleImageURL, setTitleImageURL] = useState(state.titleImageURL); // store url of title image
  const [listOfImageURLs, setListOfImageURLs] = useState(state.besideImageURLs); // list of images

  const [handleShowNotification] = useNotification(); // notify the state of adding property

  // 📝 Validation schema
  const schema = yup.object().shape({
    title: yup
      .string()
      .max(100, "Tối đa 100 ký tự")
      .min(20, "Ít nhất 20 kí tự")
      .required("Trường này được yêu cầu"),
    address: yup
      .string()
      .max(100, "Tối đa 100 ký tự")
      .min(20, "Ít nhất 20 kí tự")
      .required("Trường này được yêu cầu"),
    price: yup
      .string()
      .max(15, "Tối đa 15 ký tự")
      .min(1, "Ít nhất 3 kí tự")
      .required("Trường này được yêu cầu"),
    acreage: yup
      .number()
      .typeError("Trường này phải là 1 số nguyên dương")
      .required("Trường này được yêu cầu"),
    facade: yup
      .number()
      .typeError("Trường này phải là 1 số nguyên dương")
      .required("Trường này được yêu cầu"),
    floors: yup
      .number()
      .typeError("Trường này phải là 1 số nguyên dương")
      .required("Trường này được yêu cầu"),
    livingrooms: yup
      .number()
      .typeError("Trường này phải là 1 số nguyên dương")
      .required("Trường này được yêu cầu"),
    bedrooms: yup
      .number()
      .typeError("Trường này phải là 1 số nguyên dương")
      .required("Trường này được yêu cầu"),
    toilets: yup
      .number()
      .typeError("Trường này phải là 1 số nguyên dương")
      .required("Trường này được yêu cầu"),
  });

  // 📝 useForm hook with YUP validation
  const {
    register,
    handleSubmit,
    getValues,
    getFieldState,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 📝 Handle post update
  const handleUpdate = async (data) => {
    const valuesThatNeedToUpdate = {};

    const getDataFields = getValues(); // get values of all of the input fields

    Object.keys(getDataFields).forEach((key) => {
      // check which field is changed to update
      if (getFieldState(key).isDirty) {
        valuesThatNeedToUpdate[key] = getDataFields[key];
      }
    });

    let testStateOfPost = false;
    for (let i = 0; i < stateOfPost.length; i++) {
      if (stateOfPost[i] !== state.stateOfProperty[i]) {
        testStateOfPost = true;
      }
    }
    if (testStateOfPost) {
      valuesThatNeedToUpdate.stateOfProperty = stateOfPost;
      // update revenue for the company if transaction is successful
      if (stateOfPost[stateOfPost.length - 1]) {
        let revenue = 0;
        const userId = localStorage.getItem("userInfo");
        const profileRef = doc(db, "user_accounts", JSON.parse(userId).userId);
        if (state.unit === "million") {
          revenue = state.commission * 1000000;
        } else if (state.unit === "billion") {
          revenue = state.commission * 1000000000;
        }
        try {
          updateDoc(profileRef, {
            revenue: revenue,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (titleImageURL && titleImageURL !== state.titleImageURL) {
      // check user whether user has changed title image
      valuesThatNeedToUpdate.titleImageURL = titleImageURL;
      try {
        const desertRef = ref(storage, state.titleImageURL.imageURL);
        deleteObject(desertRef);
      } catch (error) {
        if (error.code === "storage/object-not-found") {
          console.log("File not found, skipping deletion.");
        } else {
          console.log("Deleting file failed.", error);
        }
      }

      // Delete the file
    }

    let postsRef;
    if (isHouse) {
      postsRef = doc(db, "houses", state.id); // reference to posts of database
    } else {
      postsRef = doc(db, "lands", state.id); // reference to posts of database
    }

    try {
      const date = new Date();

      if (Object.keys(valuesThatNeedToUpdate).length !== 0) {
        updateDoc(postsRef, {
          ...valuesThatNeedToUpdate,
          updatedAt:
            date.getDate() +
            "/" +
            parseInt(date.getMonth() + 1) +
            "/" +
            date.getFullYear(),
        }); // update datas that have changed
        handleShowNotification("Cập nhật bài đăng thành công", "success");
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.log("Update post failed!");
    }
  };

  return (
    <Transitions>
      <div className="w-full sm:w-4/5 mx-auto px-2">
        <h1 className="w-full text-center text-2xl font-md pt-5 pb-8">
          <span>CẬP NHẬT TÀI SẢN</span>
        </h1>
        <form
          id="post_form"
          className="w-full h-fit flex flex-col gap-y-3"
          action="/"
          method="POST"
          onSubmit={handleSubmit(handleUpdate)}
        >
          <p className="border-l-[5px] border-solid border-[#CC8C08] mb-2 text-xl pl-2">
            Nội dung chính
          </p>

          {/* Main Content */}
          <div className="text-slate-500">Cập nhật trạng thái bài đăng</div>
          <div className="flex sm:flex-row flex-col sm:justify-evenly items-start gap-y-2 gap-x-2 text-white">
            <label
              htmlFor="1"
              className="flex gap-x-2 items-center bg-green-500 p-4 rounded-md w-full"
            >
              <input
                checked={stateOfPost[0]}
                type="checkbox"
                id="1"
                onChange={(e) => {
                  setStateOfPost([
                    e.target.checked,
                    !e.target.checked,
                    !e.target.checked,
                  ]);
                }}
              />
              <span>Bài đăng mới</span>
            </label>
            <label
              htmlFor="2"
              className="flex gap-x-2 items-center bg-yellow-500 p-4 rounded-md w-full"
            >
              <input
                checked={stateOfPost[1]}
                type="checkbox"
                id="2"
                onChange={(e) => {
                  setStateOfPost([
                    !e.target.checked,
                    e.target.checked,
                    !e.target.checked,
                  ]);
                }}
              />
              <span>Đang thỏa thuận</span>
            </label>
            <label
              htmlFor="3"
              className="flex gap-x-2 items-center bg-blue-500 p-4 rounded-md w-full"
            >
              <input
                checked={stateOfPost[2]}
                type="checkbox"
                id="3"
                onChange={(e) =>
                  setStateOfPost([
                    !e.target.checked,
                    !e.target.checked,
                    e.target.checked,
                  ])
                }
              />
              <span>Giao dịch thành công</span>
            </label>
          </div>

          <div className="flex flex-col gap-y-2 mt-2">
            <label className="text-slate-500" htmlFor="title">
              Tiêu đề bài đăng
            </label>
            <input
              defaultValue={state.title}
              className={`${
                errors.title ? "border-red-500" : "border-slate-400"
              } text-xl sm:text-2xl pl-5 h-[50px] border-[1px] border-solid rounded-md outline-none focus:border-[#CC8C08]`}
              type="text"
              name="title"
              id="title"
              autoComplete="on"
              {...register("title")}
            />
            {errors.title && (
              <p className="flex items-center gap-x-1 text-red-500">
                <span>
                  <IoIosWarning />
                </span>
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-x-2 w-full">
            <div className="flex flex-col gap-y-2 basis-full sm:basis-3/4 w-full">
              <label className="text-slate-500" htmlFor="address">
                Địa chỉ
              </label>
              <input
                defaultValue={state.address}
                className={`${
                  errors.address ? "border-red-500" : "border-slate-400"
                } text-xl pl-5 h-[50px] border-[1px] border-solid rounded-md outline-none focus:border-[#CC8C08]`}
                type="text"
                name="address"
                id="address"
                autoComplete="on"
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

            <div className="flex flex-col gap-y-2 basis-full w-full sm:basis-1/4 mt-3 sm:mt-0">
              <label className="text-slate-500" htmlFor="commission">
                Phần trăm hoa hồng
              </label>
              <div className={`relative`}>
                <input
                  defaultValue={state.commission}
                  className={`${
                    errors.commission ? "border-red-500" : "border-slate-400"
                  } text-xl pl-5 h-[50px] w-full outline-none focus:border-[#CC8C08] border-[1px] border-solid rounded-md`}
                  type="text"
                  name="commission"
                  id="commission"
                  autoComplete="on"
                  {...register("commission")}
                />
                <span className="absolute h-[48px] w-[70px] flex justify-center items-center bg-slate-200 right-[1px] top-[1px] bottom-[1px] border-l-0 border-[1px] border-solid rounded-r-md">
                  %
                </span>
              </div>

              {errors.commission && (
                <p className="flex items-center gap-x-1 text-red-500">
                  <span>
                    <IoIosWarning />
                  </span>
                  <span>{errors.commission.message}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-x-5 gap-y-3 pb-5 border-b-[1px] border-solid border-slate-200">
            {isHouse && (
              <div className="text-base basis-1/3 flex flex-col gap-y-1">
                <label htmlFor="typeOfProperty" className="text-slate-500">
                  Chọn loại tài sản
                </label>
                <select
                  defaultValue={state.typeOfProperty}
                  id="typeOfProperty"
                  name="typeOfProperty"
                  className="h-[50px] border-[1px] border-solid rounded-md px-3 outline-none"
                  {...register("typeOfProperty")}
                >
                  <option value="căn hộ chung cư">Căn hộ chung cư</option>
                  <option value="văn phòng">Văn phòng</option>
                  <option value="nhà riêng">Nhà riêng</option>
                  <option value="biệt thự và liền kề">Biệt thự, liền kề</option>
                  <option value="nhà mặt phố">Nhà mặt phố</option>
                  <option value="shop house và nhà phố thương mại">
                    Shop house, nhà phố thương mại
                  </option>
                  <option value="warehouse">Kho, nhà xưởng</option>
                  <option value="boarding_house">Nhà phòng trọ</option>
                  <option value="farm_and_resort">
                    Trang trại, khu nghĩ dưỡng
                  </option>
                </select>
              </div>
            )}
            <div className="text-base basis-1/3 flex flex-col gap-y-2">
              <div className="text-slate-500">Hình thức</div>
              <div className="flex gap-x-5">
                <label className="flex items-center gap-x-1">
                  Cho thuê
                  <input
                    checked={methodWithProperty.renting}
                    type="checkbox"
                    name="renting"
                    onChange={(e) => {
                      setMethodWithProperty({
                        saling: !e.target.checked,
                        renting: e.target.checked,
                      });
                    }}
                  />
                </label>
                <label className="flex items-center gap-x-1">
                  Bán
                  <input
                    checked={methodWithProperty.saling}
                    type="checkbox"
                    name="saling"
                    onChange={(e) => {
                      setMethodWithProperty({
                        renting: !e.target.checked,
                        saling: e.target.checked,
                      });
                    }}
                  />
                </label>
              </div>
            </div>

            <div
              className={`${
                !isHouse ? "basis-2/3" : "basis-1/3"
              } flex flex-col gap-y-2 pb-5`}
            >
              <label className="text-slate-500" htmlFor="price">
                Giá tài sản
              </label>
              <div className="relative">
                <input
                  className={`${
                    errors.price ? "border-red-500" : "border-slate-400"
                  } w-full text-xl pl-5 h-[50px] border-[1px] border-solid rounded-md outline-none focus:border-[#CC8C08]`}
                  type="text"
                  name="price"
                  id="price"
                  autoComplete="on"
                  {...register("price")}
                />

                <div className="absolute flex justify-center top-[1px] bottom-[1px] right-[1px] border-l-[1px] border-solid border-slate-400 rounded-tr-md rounded-br-md overflow-hidden">
                  <select
                    id="unit"
                    name="unit"
                    className="h-[48px] px-3 outline-none"
                    {...register("unit")}
                  >
                    <option value="billion">tỷ</option>
                    <option value="million">triệu</option>
                  </select>

                  {methodWithProperty.renting === true && (
                    <span className="h-[48px] w-[70px] flex justify-center items-center bg-slate-200 border-l-0 border-[1px] border-solid rounded-r-md">
                      /tháng
                    </span>
                  )}
                </div>
              </div>
              {errors.price && (
                <p className="flex items-center gap-x-1 text-red-500">
                  <span>
                    <IoIosWarning />
                  </span>
                  <span>{errors.price.message}</span>
                </p>
              )}
            </div>
          </div>

          <div className="w-full py-5 border-b-[1px] border-solid border-slate-200">
            <p className="border-l-[5px] border-solid border-[#CC8C08] mb-5 text-xl pl-2">
              Mô tả tài sản
            </p>
            <div className="flex w-full gap-x-5">
              <div className={`${!isHouse ? "basis-[100%]" : "basis-1/2"}`}>
                <div className="flex flex-col gap-y-2 pb-5 ">
                  <label className="text-slate-500" htmlFor="acreage">
                    Diện tích
                  </label>
                  <div className="relative rounded-md">
                    <input
                      className={`${
                        errors.acreage ? "border-red-500" : "border-slate-400"
                      } w-full text-xl pl-5 h-[50px] border-[1px] border-solid rounded-md outline-none focus:border-[#CC8C08] `}
                      type="number"
                      name="acreage"
                      id="acreage"
                      autoComplete="on"
                      {...register("acreage")}
                    />
                    <span className="absolute h-[50px] w-[70px] flex justify-center items-center bg-slate-200 right-0 top-0 border-l-0 border-[1px] border-solid border-slate-400 rounded-tr-md rounded-br-md">
                      m<sup>2</sup>
                    </span>
                  </div>
                  {errors.acreage && (
                    <p className="flex items-center gap-x-1 text-red-500">
                      <span>
                        <IoIosWarning />
                      </span>
                      <span>{errors.acreage.message}</span>
                    </p>
                  )}
                </div>
                {isHouse && (
                  <div className="flex flex-col gap-y-2 pb-5 ">
                    <label className="text-slate-500" htmlFor="facade">
                      Diện tích mặt tiền
                    </label>
                    <div className="relative rounded-md overflow-hidden">
                      <input
                        className={` ${
                          errors.facade ? "border-red-500" : "border-slate-400"
                        } w-full text-xl pl-5 h-[50px] border-[1px] border-solid rounded-md outline-none focus:border-[#CC8C08] `}
                        type="number"
                        name="facade"
                        id="facade"
                        autoComplete="on"
                        defaultValue={0}
                        {...register("facade")}
                      />
                      <span className="absolute h-[50px] w-[70px] flex justify-center items-center bg-slate-200 right-0 top-0 border-l-0 border-[1px] border-solid border-slate-400 rounded-tr-md rounded-br-md">
                        m<sup>2</sup>
                      </span>
                    </div>
                    {errors.facade && (
                      <p className="flex items-center gap-x-1 text-red-500">
                        <span>
                          <IoIosWarning />
                        </span>
                        <span>{errors.facade.message}</span>
                      </p>
                    )}
                  </div>
                )}
                {isHouse && (
                  <div className="flex flex-col gap-y-2 pb-5 ">
                    <label className="text-slate-500" htmlFor="floors">
                      Số tầng
                    </label>
                    <input
                      className={`${
                        errors.floors ? "border-red-500" : "border-slate-400"
                      } text-xl pl-5 h-[50px] border-[1px] border-solid rounded-md outline-none focus:border-[#CC8C08] `}
                      type="number"
                      name="floors"
                      id="floors"
                      min={0}
                      max={300}
                      autoComplete="on"
                      defaultValue={0}
                      {...register("floors")}
                    />
                    {errors.floors && (
                      <p className="flex items-center gap-x-1 text-red-500">
                        <span>
                          <IoIosWarning />
                        </span>
                        <span>{errors.floors.message}</span>
                      </p>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-y-2 pb-5">
                  <label className="text-slate-500" htmlFor="postTitle">
                    Hướng
                  </label>
                  <select
                    id="direction"
                    name="direction"
                    className="h-[50px] border-[1px] border-solid border-slate-400 px-3 outline-none rounded-md"
                    {...register("direction")}
                  >
                    <option value="Đông">Đông</option>
                    <option value="Đông nam">Đông Nam</option>
                    <option value="Đông bắc">Đông Bắc</option>
                    <option value="Tây bắc">Tây Bắc</option>
                    <option value="Bắc">Bắc</option>
                    <option value="Nam">Nam</option>
                    <option value="Tây nam">Tây Nam</option>
                    <option value="Tây">Tây</option>
                  </select>
                </div>
              </div>
              {isHouse && (
                <div className="basis-1/2">
                  <div className="flex flex-col gap-y-2 pb-5 ">
                    <label className="text-slate-500" htmlFor="livingrooms">
                      Số phòng khách
                    </label>
                    <input
                      className={`${
                        errors.livingrooms
                          ? "border-red-500"
                          : "border-slate-400"
                      } text-xl pl-5 h-[50px] border-[1px] border-solid rounded-md outline-none focus:border-[#CC8C08] `}
                      type="number"
                      name="livingrooms"
                      id="livingrooms"
                      min={0}
                      max={300}
                      autoComplete="on"
                      defaultValue={0}
                      {...register("livingrooms")}
                    />
                    {errors.livingrooms && (
                      <p className="flex items-center gap-x-1 text-red-500">
                        <span>
                          <IoIosWarning />
                        </span>
                        <span>{errors.livingrooms.message}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-y-2 pb-5 ">
                    <label className="text-slate-500" htmlFor="bedrooms">
                      Số phòng ngủ
                    </label>
                    <input
                      className={`${
                        errors.bedrooms ? "border-red-500" : "border-slate-400"
                      } text-xl pl-5 h-[50px] border-[1px] border-solid rounded-md outline-none focus:border-[#CC8C08] `}
                      type="number"
                      name="bedrooms"
                      id="bedrooms"
                      min={0}
                      max={300}
                      autoComplete="on"
                      defaultValue={0}
                      {...register("bedrooms")}
                    />
                    {errors.bedrooms && (
                      <p className="flex items-center gap-x-1 text-red-500">
                        <span>
                          <IoIosWarning />
                        </span>
                        <span>{errors.bedrooms.message}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-y-2 pb-5 ">
                    <label className="text-slate-500" htmlFor="toilets">
                      Số toilet
                    </label>
                    <input
                      className={`${
                        errors.toilets ? "border-red-500" : "border-slate-400"
                      } text-xl pl-5 h-[50px] border-[1px] border-solid rounded-md outline-none focus:border-[#CC8C08] `}
                      type="number"
                      name="toilets"
                      id="toilets"
                      min={0}
                      max={300}
                      autoComplete="on"
                      defaultValue={0}
                      {...register("toilets")}
                    />
                    {errors.toilets && (
                      <p className="flex items-center gap-x-1 text-red-500">
                        <span>
                          <IoIosWarning />
                        </span>
                        <span>{errors.toilets.message}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-slate-500">Thông tin mô tả cụ thể</p>
              <Editor value={value} setValueEditor={setValueEditor} />
            </div>
          </div>
          <UploadImage
            setTitleImageURL={setTitleImageURL}
            setListOfImageURLs={setListOfImageURLs}
            listOfImageURLs={listOfImageURLs}
            titleImageURL={titleImageURL}
          />
          <div className="flex justify-center sm:justify-end mb-10">
            <button
              type="reset"
              className="ml-1 text-red-500 border-[2px] border-red-500 border-solid py-3 px-5 w-full sm:w-fit hover:opacity-80 uppercase rounded-md"
            >
              Reset
            </button>
            <button
              onClick={handleUpdate}
              type="button"
              className="ml-1 text-white bg-[#CC8C08] py-3 px-5 w-full sm:w-fit hover:opacity-80 uppercase rounded-md"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </Transitions>
  );
};

export default UpdatePost;

// THIS COMPONENT IS BEING BLOCK
