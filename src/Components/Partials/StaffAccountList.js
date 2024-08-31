// import hooks
import React, { useContext, useEffect, useState } from "react";
import useConfirmBox from "../../Hooks/useConfirmBox";

//import icons
import { GoDotFill } from "react-icons/go";

//import contexts
import { AppContext } from "../../Context/AppContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../FirebaseConfig/firebase";
import { useNotification } from "../../Hooks/useNotification";
import Transitions from "./Transition";

const StaffAccountsList = () => {
  const { news } = useContext(AppContext);
  const [display] = useConfirmBox();
  const [userAccounts, setUserAccounts] = useState(null);

  const [handleShowNotification] = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const fetchData = async () => {
    try {
      await getDocs(collection(db, "user_accounts")).then((response) => {
        const dataResponsed = response.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        let newArray = dataResponsed.filter((e) => e.role === "staff");

        setUserAccounts(newArray);
      });
    } catch (error) {
      console.log(error);
      handleShowNotification(
        "Kết nối mạng không ổn định! Hãy thử lại sau.",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const listOfPostsWereDevided = [];
  for (let i = currentPage * 6 - 6; i < currentPage * 6; i++) {
    if (i >= news.length) {
      break;
    }
    listOfPostsWereDevided.push(news[i]);
  }

  const buttonsArray = [];
  for (let j = 1; j <= Math.ceil(news.length / 6); j++) {
    buttonsArray.push(j);
  }

  const handleToDeleteStaffAccount = async (element) => {
    display("Bạn có chắc chắn muốn xóa nhân viên này?", element, "user_accounts");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Transitions>
      <div className=" border-[1px] border-solid border-slate-200 p-4 text-center mt-5 rounded-t-xl">
        <div className="flex items-center gap-x-2 text-xl">
          <span>
            <GoDotFill />
          </span>
          <span>Danh sách tài khoản người dùng</span>
        </div>

        <div className="w-full mt-5 h-fit">
          {/* Search Input */}
          {/* <div className="w-full flex justify-end items-center gap-x-1 border-b-[1px] border-b-solid border-b-slate-200 pb-10">
          <input
            className="pl-2 w-[200px] sm:w-[250px] h-[40px] border-solid border-[2px] border-slate-400 outline-none focus:border-[#0B60B0]"
            type="text"
            placeholder="Tên bài đăng"
          />
          <button className="text-white h-[40px] px-3 bg-[#0B60B0]">
            Tìm kiếm
          </button>
        </div> */}

          <div className="w-[350px] overflow-x-scroll sm:overflow-auto sm:w-full">
            {/* Properties */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#40A2D8] text-white">
                  <th className="border-[1px] border-solid border-slate-200 p-4 text-center">
                    STT
                  </th>
                  <th className="border-[1px] border-solid border-slate-200 p-4 text-center">
                    Tên người dùng
                  </th>
                  <th className="border-[1px] border-solid border-slate-200 p-4 text-center">
                    Ngày sinh
                  </th>
                  <th className="border-[1px] border-solid border-slate-200 p-4 text-center">
                    Vị trí
                  </th>
                  <th className="border-[1px] border-solid border-slate-200 p-4 text-center">
                    Địa chỉ
                  </th>
                  <th className="border-[1px] border-solid border-slate-200 p-4 text-center">
                    Doanh thu
                  </th>
                  <th className="border-[1px] border-solid border-slate-200 p-4 text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {userAccounts ? (
                  userAccounts.map((element, index) => (
                    <tr key={index}>
                      <td
                        className={`border-[1px] border-solid border-slate-200 p-4 text-center`}
                      >
                        {index + 1}
                      </td>
                      <td className="border-[1px] border-solid border-slate-200 p-4 text-center">
                        {element.username}
                      </td>
                      <td className="border-[1px] border-solid border-slate-200 p-4 text-center">
                        {element.dateOfBirth}
                      </td>
                      <td className="border-[1px] border-solid border-slate-200 p-4 text-center">
                        {element.position}
                      </td>
                      <td className="border-[1px] border-solid border-slate-200 p-4 text-center">
                        {element.address}
                      </td>
                      <td className="border-[1px] border-solid border-slate-200 p-4 text-center">
                        {element.revenue}
                      </td>
                      <td className="border-[1px] border-solid border-slate-200 p-4 text-center">
                        <button
                          className="text-red-500"
                          onClick={() => handleToDeleteStaffAccount(element)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="row-span-full">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Posts list */}
          </div>
          {/*Pagenation*/}
          <div className="w-full flex justify-center gap-x-1 mt-10">
            {buttonsArray?.map((button, index) => (
              <button
                onClick={() => setCurrentPage(button)}
                key={index}
                className="w-[50px] h-[50px] border-[1px] border-solid border-slate-300 bg-[#40A2D8] text-white"
              >
                {button}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Transitions>
  );
};

export default StaffAccountsList;
