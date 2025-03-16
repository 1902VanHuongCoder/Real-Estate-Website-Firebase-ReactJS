import React from "react";

const NotFound = () => {
  return (
    <div className="w-screen h-[calc(100vh-124px)] flex justify-center flex-col items-center">
      <div className="text-9xl font-semibold text-red-500">404</div>
      <p className="opacity-90">Không tìm thấy trang</p>
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-5 px-4 py-2 bg-[#CC8C08] rounded-md text-white"
      >
        Trang chủ
      </button>
    </div>
  );
};

export default NotFound;
