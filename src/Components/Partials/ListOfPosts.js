// 📦 Import hooks
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// 📦 Import icons
import { GoDotFill } from "react-icons/go";

// 🌐 Import contexts
import { AppContext } from "../../Context/AppContext";

// 📦 Import custom hooks
import useConfirmBox from "../../Hooks/useConfirmBox";
import Transitions from "./Transition";

// 🏷️ ListOfPosts component
const ListOfPosts = () => {
  const { postsWasFiltered } = useContext(AppContext);

  const [display] = useConfirmBox();

  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const listOfPostsWereDevided = [];
  for (let i = currentPage * 6 - 6; i < currentPage * 6; i++) {
    if (i >= postsWasFiltered.length) {
      break;
    }
    listOfPostsWereDevided.push(postsWasFiltered[i]);
  }

  const buttonsArray = [];
  for (let j = 1; j <= Math.ceil(postsWasFiltered.length / 6); j++) {
    buttonsArray.push(j);
  }

  // 📝 Handle delete post
  const handleToDeletePost = async (element) => {
    display("Bạn có chắc chắn muốn xóa bài đăng này?", element, "posts");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 📝 Handle update post
  const handleUpdatePost = (element) => {
    navigate("/staff/update+post", { state: element });
  };

  return (
    <Transitions>
      <div className="p-5 border-[1px] border-solid border-slate-200 mt-5 rounded-t-xl">
        <div className="flex items-center gap-x-2 text-xl mb-4">
          <span>
            <GoDotFill />
          </span>
          <span>Danh sách bài đăng của công ty</span>
        </div>

        <div className="w-full h-fit">
          {/* List posts that are waiting accepting */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {postsWasFiltered.length > 0 ? (
              listOfPostsWereDevided?.map((element, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between w-full h-fit sm:h-[550px] bg-white rounded-t-md hover:shadow-lg transition-shadow border-[1px] border-solid border-slate-200 overflow-hidden"
                >
                  <div className="h-fit w-full mb-4">
                    <div
                      className="w-full h-[300px] bg-cover bg-center"
                      style={{
                        backgroundImage: `url("${element.titleImageURL.imageURL}")`,
                      }}
                    ></div>
                    <div className="py-3 px-2 flex flex-col gap-y-2">
                      <p className="text-xl font-medium">{element.title}</p>
                      <div className="text-lg flex gap-x-1">
                        <span className="text-slate-500">Ngày đăng:</span>
                        <span>{element.createdAt}</span>
                      </div>
                      <div className="text-lg flex gap-x-1">
                        <span className="text-slate-500">Nhân viên:</span>
                        <span>Tô Văn Hưởng</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-x-2 mr-5 mb-5 justify-end">
                    <button
                      onClick={() => handleToDeletePost(element)}
                      className="hover:opacity-80 px-5 py-3 font-medium bg-red-500 text-white rounded-md"
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() => handleUpdatePost(element)}
                      className="hover:opacity-80 px-5 py-3 border-[2px] border-solid border-[#CC8C08] font-medium rounded-md"
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div>Không có dữ liệu bài đăng</div>
            )}
          </div>

          {/* Pagination */}
          <div className="w-full flex justify-center gap-x-1 mt-10">
            {buttonsArray?.map((button, index) => (
              <button
                onClick={() => setCurrentPage(button)}
                key={index}
                className="w-[50px] h-[50px] border-[1px] border-solid border-slate-300 bg-[#CC8C08] text-white rounded-md"
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

export default ListOfPosts;
