// import hooks
import React, { useContext } from "react";
import { useNotification } from "../Hooks/useNotification";
// import packages
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoIosWarning } from "react-icons/io";

// import firebase services
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup } from "firebase/auth";
import { db, app } from "../FirebaseConfig/firebase";
import {
  QuerySnapshot,
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

//import context
import { AppContext } from "../Context/AppContext";

//import library
import md5 from "md5";

const SignUp = () => {
  const { setSession } = useContext(AppContext);

  const [handleShowNotification] = useNotification(); //custom hook

  const schema = yup.object().shape({
    // schema to validate form datas
    username: yup
      .string()
      .min(6, "Tên phải dài hơn 6 kí tự")
      .max(20, "Tên phải ngắn hơn 20 kí tự")
      .required(),
    email: yup.string().email().required("Đây là trường bắt buộc"),
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

  // use useForm() hook and combine with YUP library to validate form datas
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // handle sign-up with the form datas
  const handleSignUp = async (data) => {
    // handle sign-up of user
    let flag = false;
    if (
      data.password !== "" &&
      md5(data.password) === md5(data.confirm_password) // encrypte password with md5 library to increase security for sensitive datas
    ) {
      flag = true;
    }

    if (flag) {
      const userAccountRef = collection(db, "user_accounts"); // reference to user accounts in database
      const q = query(userAccountRef, where("email", "==", data.email)); // query whether this email had existed in database
      const result = await getDocs(q); // the query command will reuturn a document list that equal to email
      if (result.docs.length === 0) { // if this account has not existed, add to database
        const dataToStore = {
          username: data.username,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: md5(data.password),
          create_at: serverTimestamp(),
          update_at: serverTimestamp(),
          role: "user",
          photoURL: null,
        };
        await addDoc(collection(db, "user_accounts"), dataToStore); // add document to user_accounts table in database
        localStorage.setItem("email", data.email); // increase UX for sequential visits.
        setSession(dataToStore); // set value for sesstion context
      } else { // otherwise, require user to sign-up with new email
        handleShowNotification(
          "Email này đã được sử dụng! Vui lòng sử dụng 1 email khác.",
          "error"
        );
      }
    } else {
      // handle errors when there are problems
      handleShowNotification(
        "Xác nhận mật khẩu không chính xác. Kiểm tra lại xác nhận mật khẩu của bạn",
        "error"
      );
    }
  };

  // handle sign-up with Google Provider through Firebase SDK
  const handleSignUpWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider(); // use Google provider to authenticate user.
    try {
      const result = await signInWithPopup(auth, provider); // render popup to authenticate with Google
      const user = result.user; // some basic user informations are returned.
      const userData = {
        username: user.displayName,
        email: user.email,
        phoneNumber: null,
        password: user.uid,
        create_at: serverTimestamp(),
        update_at: serverTimestamp(),
        role: "user",
        photoURL: user.photoURL,
      };

      // check whether user had existed
      const userAccountRef = collection(db, "user_accounts");
      const q = query(userAccountRef, where("email", "==", user.email));
      const queryResult = await getDocs(q);
      if (queryResult.docs.length === 0) {
        await addDoc(collection(db, "user_accounts"), userData);
        localStorage.setItem("email", user.email);
        setSession(userData); // set value for sesstion context
      } else {
        handleShowNotification(
          "Email này đã được sử dụng! Vui lòng sử dụng 1 email khác.",
          "error"
        );
      }
    } catch (error) {
      const errorMessage = error.message;
      handleShowNotification(
        "Quá trình đăng kí xảy ra lỗi. Vui lòng thử lại",
        "error"
      );
      console.log(errorMessage);
    }
  };
  return (
    <div className="w-full h-fit flex justify-center items-center">
      <div className="w-[400px] h-fit shadow-md p-5 border-[1px] border-solid border-slate-200 my-[50px]">
        <h1 className="py-6 text-xl uppercase text-center font-medium">
          Đăng ký
        </h1>
        <form
          onSubmit={handleSubmit(handleSignUp)}
          action="/"
          method="POST"
          className="flex flex-col gap-y-4"
        >
          <div className="flex flex-col gap-y-2">
            <label className="text-slate-500" htmlFor="username">
              Tên đăng nhập
            </label>
            <input
              className={`${
                errors.username ? "border-red-500" : "border-slate-400"
              } text-base pl-5 h-[50px] border-[1px] border-solid rounded-none outline-none focus:border-[#0B60B0] `}
              id="username"
              name="username"
              type="text"
              autoComplete="off"
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
          <div className="flex flex-col gap-y-2">
            <label className="text-slate-500" htmlFor="email">
              Địa chỉ email
            </label>
            <input
              className={`${
                errors.email ? "border-red-500" : "border-slate-400"
              } text-base pl-5 h-[50px] border-[1px] border-solid rounded-none outline-none focus:border-[#0B60B0] `}
              id="email"
              name="email"
              type="text"
              autoComplete="on"
              {...register("email")}
            />
            {errors.email && (
              <p className="flex items-center gap-x-1 text-red-500">
                <span>
                  <IoIosWarning />
                </span>
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-slate-500" htmlFor="phoneNumber">
              Số điện thoại
            </label>
            <input
              className={`${
                errors.phoneNumber ? "border-red-500" : "border-slate-400"
              } text-base pl-5 h-[50px] border-[1px] border-solid rounded-none outline-none focus:border-[#0B60B0] `}
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              autoComplete="on"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="flex items-center gap-x-1 text-red-500">
                <span>
                  <IoIosWarning />
                </span>
                <span>{errors.phoneNumber.message}</span>
              </p>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-slate-500" htmlFor="password">
              Mật khẩu
            </label>
            <input
              className={`${
                errors.password ? "border-red-500" : "border-slate-400"
              } text-base pl-5 h-[50px] border-[1px] border-solid rounded-none outline-none focus:border-[#0B60B0] `}
              id="password"
              name="password"
              type="password"
              autoComplete="on"
              {...register("password")}
            />
            {errors.password && (
              <p className="flex items-center gap-x-1 text-red-500">
                <span>
                  <IoIosWarning />
                </span>
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-slate-500" htmlFor="password">
              Xác nhận mật khẩu
            </label>
            <input
              className={`${
                errors.confirm_password ? "border-red-500" : "border-slate-400"
              } text-base pl-5 h-[50px] border-[1px] border-solid rounded-none outline-none focus:border-[#0B60B0] `}
              id="confirm_password"
              name="confirm_password"
              type="password"
              autoComplete="on"
              {...register("confirm_password")}
            />
            {errors.confirm_password && (
              <p className="flex items-center gap-x-1 text-red-500">
                <span>
                  <IoIosWarning />
                </span>
                <span>{errors.confirm_password.message}</span>
              </p>
            )}
          </div>
          <div className="flex justify-center mt-5">
            <button
              type="submit"
              className="ml-1 text-white bg-[#0B60B0] h-[40px] px-5 w-[150px] hover:opacity-80"
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
                src="./images/google_logo.png"
                alt="Google Logo"
              />
            </span>
          </div>
          <div className="flex gap-x-1 items-center justify-center">
            <span>Nếu bạn đã có tài khoản! </span>
            <span className="text-[#40A2D8] underline">
              <a href="/">Đăng nhập</a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
