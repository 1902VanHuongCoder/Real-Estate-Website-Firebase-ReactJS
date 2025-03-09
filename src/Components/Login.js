// 📦 Import hooks
import React, { useContext, useEffect, useState } from "react";
import { useNotification } from "../Hooks/useNotification";

// 📦 Import libraries
import md5 from "md5";
import { Link, useNavigate } from "react-router-dom";

// 🔥 Import firebase services
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../FirebaseConfig/firebase";

// 📦 Import icons
import { FaEye, FaEyeSlash } from "react-icons/fa";

// 📦 Import components
import Transitions from "./Partials/Transition";

// 🌐 Import context
import { AppContext } from "../Context/AppContext";

// 🏷️ Login component
const Login = () => {
  const [handleShowNotification] = useNotification(); // Custom hook
  const [showPassword, setShowPassword] = useState(false);
  const { setSession, setShowSpinner, session, setShowCongratulation } =
    useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 📝 Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    const userAccountRef = collection(db, "user_accounts"); // Reference to user accounts in database
    const q = query(userAccountRef, where("email", "==", email)); // Query whether this email exists in database
    const result = await getDocs(q); // The query command will return a document list that matches the email

    if (result.docs.length < 1) {
      // If this account does not exist, notify the user to sign up for a new account
      handleShowNotification("Bạn chưa có tài khoản. Hãy đăng ký!", "error");
    } else {
      result.docs.forEach((doc) => {
        if (doc.data().registerMethod === "emailAndPassword") {
          if (doc.data().password === md5(password)) {
            handleShowNotification("Đăng nhập thành công!", "success");
            localStorage.setItem(
              "userInfo",
              JSON.stringify({ userId: doc.id })
            );
            const data = { ...doc.data(), id: doc.id };
            setSession(data);
            setShowCongratulation(true);
          } else {
            handleShowNotification("Sai mật khẩu", "error");
          }
        } else if (doc.data().registerMethod === "google") {
          handleShowNotification("Đăng nhập thành công!", "success");
          localStorage.setItem("userInfo", JSON.stringify({ userId: doc.id }));
          const data = { ...doc.data(), id: doc.id };
          setSession(data);
          setShowCongratulation(true);
        }
      });
    }
    setShowSpinner(false);
  };

  const userInfo = localStorage.getItem("userInfo");

  useEffect(() => {
    if (userInfo && session) {
      if (session.role === "user") {
        navigate("/");
      } else if (session.role === "admin") {
        navigate("/admin/list+of+posts");
      } else if (session.role === "staff") {
        navigate("/staff/list+posts+of+staff");
      }
    }
  }, [userInfo, session, navigate]);

  return (
    <Transitions>
      <div className="w-full min-h-screen flex justify-center items-center font-roboto bg-white sm:bg-gradient-to-tr from-[#CC8C08] to-[#FEFFAF]">
        <div className="w-full sm:w-[400px] h-fit sm:shadow-md p-5 sm:border-[1px] sm:border-solid sm:border-slate-200 my-[50px] bg-white rounded-md">
          <h1 className="py-6 text-3xl uppercase text-center font-medium text-[#CC8C08]">
            Đăng Nhập
          </h1>
          <form
            method="POST"
            onSubmit={handleLogin}
            className="flex flex-col gap-y-4"
          >
            <div className="flex flex-col gap-y-2">
              <label className="text-slate-500 pl-2" htmlFor="email">
                Địa chỉ email
              </label>
              <input
                className={`border-slate-400 text-base pl-5 h-[50px] border-[1px] border-solid outline-none focus:border-[#CC8C08] rounded-md`}
                id="email"
                name="email"
                type="email"
                autoComplete="on"
                onChange={(e) => setEmail(e.target.value)}
              />
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
                  className={`border-slate-400 w-full text-base pl-5 h-[50px] border-[1px] border-solid outline-none focus:border-[#CC8C08] rounded-md`}
                  id="password"
                  name="password"
                  autoComplete="on"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <button
                type="submit"
                className="ml-1 text-white bg-[#CC8C08] h-[40px] px-5 w-[150px] hover:opacity-80 rounded-md"
              >
                Đăng nhập
              </button>
            </div>
            <div className="flex justify-center items-center gap-x-1 pb-6">
              <span>Nếu bạn chưa có tài khoản! </span>
              <span className="text-[#CC8C08] underline">
                <Link to="/real+estate/signup">Đăng ký ngay</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </Transitions>
  );
};

export default Login;
