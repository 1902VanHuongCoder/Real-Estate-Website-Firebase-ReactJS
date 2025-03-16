// 📦 Import hooks
import React, { useContext, useEffect, useState } from "react";

// 📦 Import icons
import { GoDotFill } from "react-icons/go";
import { FaBook, FaUser } from "react-icons/fa";

// 🌐 Import contexts
import { AppContext } from "../Context/AppContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../FirebaseConfig/firebase";

// 📦 Import custom hooks
import { useNotification } from "../Hooks/useNotification";
import Transitions from "./Partials/Transition";
import BarChart from "./Partials/BarChart";

// 🏷️ GeneralInfo component
const GeneralInfo = () => {
  const { postsWasFiltered } = useContext(AppContext);
  const [userAccount, setUserAccounts] = useState(null);
  const [handleShowNotification] = useNotification();

  // 📝 Fetch user accounts data
  const fetchData = async () => {
    try {
      await getDocs(collection(db, "user_accounts")).then((response) => {
        const dataResponsed = response.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUserAccounts(dataResponsed);
      });
    } catch (error) {
      console.log(error);
      handleShowNotification(
        "Kết nối mạng không ổn định! Hãy thử lại sau.",
        "error"
      );
    }
  };

  // 📝 Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📝 Handle data for charts
  const handleData = () => {
    const xAxis = [];
    const columnName = [];
    let totalRevenue = 0;
    userAccount.forEach((element) => {
      if (element.role === "staff") {
        xAxis.push(element.revenue);
        columnName.push(element.username);
        totalRevenue += element.revenue;
      }
    });

    return { xAxis: xAxis, columnName: columnName, totalRevenue: totalRevenue };
  };

  const dataToDisplay = userAccount && handleData();

  return (
    <Transitions>
      <div className="flex flex-col gap-y-10 rounded-md border-[1px] p-4">
        {/* General information */}
        <div className="">
          <div className="flex items-center gap-x-2 text-xl">
            <span>
              <GoDotFill />
            </span>
            <span>Thông tin chung</span>
          </div>

          <div className="flex gap-2 mt-5 flex-wrap mb-10">
            <div
              style={{
                background:
                  "linear-gradient(59deg, rgba(253,200,36,1) 2%, rgba(204,140,8,1) 99%)",
              }}
              className="w-full sm:w-[300px] bg-[rgb(253,200,36)] border-[1px] border-solid border-slate-200 p-4 rounded-md flex gap-x-5 items-center"
            >
              <span className="text-white w-[50px] h-[50px] rounded-full flex justify-center items-center bg-[#CC8C08]">
                <FaBook />
              </span>
              <span className="text-white drop-shadow-md">
                <span className="text-2xl sm:text-xl font-medium">
                  {postsWasFiltered
                    ? postsWasFiltered.length > 9
                      ? postsWasFiltered.length
                      : "0" + postsWasFiltered.length
                    : 0}
                </span>{" "}
                <span className="text-xl"> bài đăng</span>
              </span>
            </div>
            <div
              style={{
                background:
                  "linear-gradient(59deg, rgba(253,200,36,1) 2%, rgba(204,140,8,1) 99%)",
              }}
              className="w-full sm:w-[300px] bg-[rgb(253,200,36)] border-[1px] border-solid border-slate-200 p-4 rounded-md flex gap-x-5 items-center"
            >
              <span className="text-white w-[50px] h-[50px] rounded-full flex justify-center items-center bg-[#CC8C08]">
                <FaUser />
              </span>
              <span className="text-white drop-shadow-md">
                <span className="text-2xl sm:text-xl font-medium">
                  {userAccount
                    ? userAccount.length > 9
                      ? userAccount.length
                      : "0" + userAccount.length
                    : 0}
                </span>
                <span className="text-xl"> tài khoản</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-x-2 text-xl">
            <span>
              <GoDotFill />
            </span>
            <span>Doanh thu tổng</span>
          </div>

          <div className="text-4xl sm:text-6xl flex justify-center items-center my-4 text-black border-[2px] border-solid border-[#CC8C08] rounded-md p-4 bg-[#CC8C08] bg-opacity-10">
            <span className="flex gap-x-4 items-end ">
              {" "}
              <span>
                {dataToDisplay
                  ? formatNumber(parseInt(dataToDisplay?.totalRevenue))
                  : 0}
              </span>
              <span className="text-2xl">VNĐ</span>
            </span>
          </div>

          <div className="flex items-center gap-x-2 text-xl mt-10">
            <span>
              <GoDotFill />
            </span>
            <span>Doanh thu của các nhân viên</span>
          </div>
          {userAccount && (
            <BarChart
              data={dataToDisplay?.xAxis}
              columnName={dataToDisplay?.columnName}
            />
          )}
        </div>
      </div>
    </Transitions>
  );
};

export default GeneralInfo;
