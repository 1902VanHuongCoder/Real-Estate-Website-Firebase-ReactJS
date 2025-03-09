// 📦 Import hooks
import React, { useContext, useState } from "react";
import { useNotification } from "../Hooks/useNotification";

// 📦 Import packages
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoIosWarning } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// 🔥 Import firebase services
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { db, app } from "../FirebaseConfig/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

// 🌐 Import context
import { AppContext } from "../Context/AppContext";

// 📦 Import libraries
import md5 from "md5";
import { Link, useNavigate } from "react-router-dom";
import Transitions from "./Partials/Transition";

// 📷 Import images
import flagIcon from "../images/vn_flag_icon.png";
import googleIcon from "../images/google_logo.png";

// 🏷️ SignUp component
const SignUp = () => {
  const auth = getAuth(app);
  const { setSession, setShowSpinner, setShowCongratulation } =
    useContext(AppContext);
  const [handleShowNotification] = useNotification(); // Custom hook
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // 📝 Validation schema
  const schema = yup.object().shape({
    username: yup
      .string()
      .min(6, "Tên phải dài hơn 6 kí tự")
      .max(20, "Tên phải ngắn hơn 20 kí tự")
      .required(),
    email: yup
      .string()
      .email("Địa chỉ email không hợp lệ")
      .required("Đây là trường bắt buộc"),
    phoneNumber: yup
      .string()
      .min(3, "Số điện thoại phải lớn hơn 2 số")
      .max(11, "Số điện thoại phải nhỏ hơn 12 số")
      .required(),
    password: yup
      .string()
      .min(6, "Mật khẩu phải dài hơn 6 kí tự")
      .max(12, "Mật khẩu tối đa 12 kí tự")
      .required(),
    confirm_password: yup.string().required("Đây là trường bắt buộc"),
  });

  // 📝 useForm hook with YUP validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 📝 Handle sign-up with form data
  const handleSignUp = async (data) => {
    let flag = false;
    const date = new Date();
    if (
      data.password !== "" &&
      md5(data.password) === md5(data.confirm_password)
    ) {
      flag = true;
    }

    if (flag) {
      setShowSpinner(true);
      let state = true;
      try {
        const res = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const dataToStore = {
          userId: res.user.uid,
          username: data.username,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: md5(data.password),
          createdAt: `${date.getDay()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`,
          updatedAt: `${date.getDay()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`,
          role: "user",
          photoURL: "",
          address: "",
          backgroundURL: "",
          registerMethod: "emailAndPassword",
        };

        await setDoc(doc(db, "user_accounts", res.user.uid), dataToStore);
        await setDoc(doc(db, "userChats", res.user.uid), {});
      } catch (error) {
        state = false;
      }

      if (state) {
        handleShowNotification("Đăng ký tài khoản thành công!", "success");
        navigate("/real+estate/signin");
      } else {
        handleShowNotification(
          "Đăng ký tài khoản không thành công. Hãy thử lại!",
          "error"
        );
      }
    } else {
      handleShowNotification(
        "Xác nhận mật khẩu không chính xác. Kiểm tra lại xác nhận mật khẩu của bạn",
        "error"
      );
    }
    window.scrollTo(0, 0);
    setShowSpinner(false);
  };

  // 📝 Handle sign-up with Google
  const handleSignUpWithGoogle = async () => {
    const date = new Date();
    const auth = getAuth(app);
    let flag = false;
    let userEmail = "";
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      userEmail = res.user.email;
      const dataToStore = {
        userId: res.user.uid,
        username: res.user.displayName,
        email: res.user.email,
        phoneNumber: "",
        password: res.user.uid,
        createdAt: `${date.getDay()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`,
        updatedAt: `${date.getDay()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`,
        role: "user",
        photoURL: res.user.photoURL,
        address: "",
        backgroundURL: "",
        registerMethod: "google",
      };

      const userAccountRef = collection(db, "user_accounts");
      const q = query(userAccountRef, where("email", "==", res.user.email));
      const queryResult = await getDocs(q);

      if (queryResult.docs.length < 1) {
        await setDoc(doc(db, "user_accounts", res.user.uid), dataToStore);
        await setDoc(doc(db, "userChats", res.user.uid), {});
        handleShowNotification("Đăng ký tài khoản thành công!", "success");
        flag = true;
      } else {
        handleShowNotification(
          "Email này đã được sử dụng! Vui lòng sử dụng 1 email khác.",
          "error"
        );
      }
    } catch (error) {
      handleShowNotification(
        "Kết nối mạng không ổn định. Vui lòng thử lại",
        "error"
      );
      console.log(error.message);
    }

    if (flag) {
      const userAccountRef = collection(db, "user_accounts");
      const q = query(userAccountRef, where("email", "==", userEmail));
      const result = await getDocs(q);
      result.docs.forEach((doc) => {
        const dataToStoreToLocalStorage = { userId: doc.id };
        localStorage.setItem(
          "userInfo",
          JSON.stringify(dataToStoreToLocalStorage)
        );
        const data = { ...doc.data(), id: doc.id };
        setSession(data);
        setShowCongratulation(true);
      });
      navigate("/");
    }
  };

  return (
    <Transitions>
      <div
        className="w-full h-fit flex justify-center items-center font-roboto bg-white sm:bg-gradient-to-tr from-[#CC8C08] to-[#FEFFAF] "
        // sytle={{ background: "linear-gradient(to right, #CC8C08, #FEFFAF" }}
      >
        <div className="w-full sm:w-[400px] h-fit sm:shadow-md p-5 sm:border-[1px] sm:border-solid sm:border-slate-200 my-[50px] bg-white rounded-md">
          <h1 className="py-6 text-3xl uppercase text-center font-medium text-[#CC8C08]">
            Đăng ký
          </h1>
          <form
            onSubmit={handleSubmit(handleSignUp)}
            className="flex flex-col gap-y-4"
          >
            <div className="flex flex-col gap-y-2">
              <label className="text-slate-500 pl-2" htmlFor="username">
                Tên đăng nhập
              </label>
              <input
                className={`${
                  errors.username ? "border-red-500" : "border-slate-400"
                } text-base pl-5 h-[50px] border-[1px] border-solid outline-none focus:border-[#CC8C08] rounded-md`}
                id="username"
                name="username"
                type="text"
                autoComplete="on"
                {...register("username")}
              />
              {errors.username && (
                <p className="flex items-center gap-x-1 text-red-500">
                  <IoIosWarning />
                  <span>{errors.username.message}</span>
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-slate-500 pl-2" htmlFor="email">
                Địa chỉ email
              </label>
              <input
                className={`${
                  errors.email ? "border-red-500" : "border-slate-400"
                } text-base pl-5 h-[50px] border-[1px] border-solid outline-none focus:border-[#CC8C08] rounded-md`}
                id="email"
                name="email"
                type="email"
                autoComplete="on"
                {...register("email")}
              />
              {errors.email && (
                <p className="flex items-center gap-x-1 text-red-500">
                  <IoIosWarning />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-slate-500 pl-2" htmlFor="phoneNumber">
                Số điện thoại
              </label>
              <div className="relative w-full h-fit">
                <span className="absolute -left-[1px] -top-[1px] w-[100px] h-[52px] flex items-center gap-x-1 pl-2 bg-slate-200 rounded-tl-md rounded-bl-md">
                  <img
                    className="w-[40px] h-[30px] bg-cover bg-center"
                    src={flagIcon}
                    alt="vn_flag_icon"
                  />
                  <span className="font-semibold">+84</span>
                </span>
                <input
                  className={`${
                    errors.phoneNumber ? "border-red-500" : "border-slate-400"
                  } w-full text-base pl-28 h-[50px] border-[1px] border-solid outline-none focus:border-[#CC8C08] rounded-md`}
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  autoComplete="on"
                  {...register("phoneNumber")}
                />
              </div>
              {errors.phoneNumber && (
                <p className="flex items-center gap-x-1 text-red-500">
                  <IoIosWarning />
                  <span>{errors.phoneNumber.message}</span>
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-slate-500 pl-2" htmlFor="password">
                Mật khẩu
              </label>
              <div className="relative">
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-[50px] flex justify-center items-center w-[40px] text-slate-500 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                <input
                  className={`${
                    errors.password ? "border-red-500" : "border-slate-400"
                  } w-full text-base pl-5 h-[50px] border-[1px] border-solid outline-none focus:border-[#CC8C08] rounded-md`}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="on"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="flex items-center gap-x-1 text-red-500">
                  <IoIosWarning />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-slate-500 pl-2" htmlFor="confirm_password">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-[50px] flex justify-center items-center w-[40px] text-slate-500 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                <input
                  className={`${
                    errors.confirm_password
                      ? "border-red-500"
                      : "border-slate-400"
                  } w-full text-base pl-5 h-[50px] border-[1px] border-solid outline-none focus:border-[#CC8C08] rounded-md`}
                  id="confirm_password"
                  name="confirm_password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="on"
                  {...register("confirm_password")}
                />
              </div>
              {errors.confirm_password && (
                <p className="flex items-center gap-x-1 text-red-500">
                  <IoIosWarning />
                  <span>{errors.confirm_password.message}</span>
                </p>
              )}
            </div>
            <div className="flex justify-center mt-5">
              <button
                type="submit"
                className="ml-1 text-white bg-[#CC8C08] h-[40px] px-5 w-[150px] hover:opacity-80 rounded-md"
              >
                Đăng ký
              </button>
            </div>
            <div
              onClick={handleSignUpWithGoogle}
              className="cursor-pointer flex items-center gap-x-2 justify-center py-5"
            >
              <span>Đăng ký bằng</span>
              <span className="w-[50px] h-[50px] rounded-full bg-slate-100 flex justify-center items-center">
                <img
                  className="w-[40px] h-[40px]"
                  src={googleIcon}
                  alt="Google Logo"
                />
              </span>
            </div>
            <div className="flex gap-x-1 items-center justify-center pb-6">
              <span>Nếu bạn đã có tài khoản! </span>
              <span className="text-[#CC8C08] underline">
                <Link to="/real+estate/signin">Đăng nhập</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </Transitions>
  );
};

export default SignUp;
