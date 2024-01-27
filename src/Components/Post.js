import React from "react";

const Post = () => {
  return (
    <div className="w-4/5 p-5 mx-auto">
      <h1 className="w-full text-center text-2xl font-md">ĐĂNG BÀI</h1>
      <form
        className="w-full h-fit flex flex-col gap-y-3"
        action="/"
        method="POST"
      >
        <p className="pb-5 text-xl">Nội dung chính</p>
        <div className="flex flex-col gap-y-2">
          <label className="text-slate-500" htmlFor="postTitle">
            Tiêu đề bài đăng
          </label>
          <input
            className="text-2xl pl-5 h-[50px] border-[1px] border-solid border-slate-400 rounded-none outline-none focus:border-[#0B60B0] "
            type="text"
            name="postTitle"
            id="postTitle"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <label className="text-slate-500" htmlFor="address">
            Địa chỉ
          </label>
          <input
            className="text-xl pl-5 h-[50px] border-[1px] border-solid border-slate-400 rounded-none outline-none focus:border-[#0B60B0] "
            type="text"
            name="address"
            id="address"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <label className="text-slate-500" htmlFor="price">
            Giá khởi điểm
          </label>
          <input
            className="text-xl pl-5 h-[50px] border-[1px] border-solid border-slate-400 rounded-none outline-none focus:border-[#0B60B0] "
            type="text"
            name="price"
            id="price"
          />
        </div>
        <div className="flex gap-x-5 pb-10 border-b-[1px] border-solid border-slate-200">
          <div className="text-base basis-1/2 flex flex-col gap-y-1">
            <label className="text-slate-500">Chọn loại tài sản</label>
            <select
              id="typeOfProperty"
              className="h-[50px] border-[1px] border-solid border-slate-400 px-3 outline-none"
            >
              <option value="east">Căn hộ chung cư</option>
              <option value="southeast">Văn phòng</option>
              <option value="northeast">Nhà riêng</option>
              <option value="northwest">Biệt thự, liền kề</option>
              <option value="north">Nhà mặt phố</option>
              <option value="south">Shop house, nhà phố thương mại</option>
              <option value="southwest">Kho, nhà xưởng</option>
              <option value="west">Nhà phòng trọ</option>
              <option value="west">Trang trại, khu nghĩ dưỡng</option>
            </select>
          </div>
          <div className="text-base basis-1/2 flex flex-col gap-y-4">
            <div className="text-slate-500">Hình thức bài đăng</div>
            <div className="flex gap-x-5">
              <label className="flex items-center gap-x-1">
                Nhà đất cho thuê
                <input type="radio" id="postMethod" name="postMethod" />
              </label>
              <label className="flex items-center gap-x-1">
                Nhà đất bán
                <input type="radio" id="postMethod" name="postMethod" />
              </label>
            </div>
          </div>
        </div>
        <div className="w-full py-5 border-b-[1px] border-solid border-slate-200">
          <p className="pb-5 text-xl">Mô tả tài sản</p>
          <div className="flex w-full gap-x-5">
            <div className="basis-1/2">
              <div className="flex flex-col gap-y-2 pb-5 ">
                <label className="text-slate-500" htmlFor="acreage">
                  Diện tích
                </label>
                <div className="relative">
                  <input
                    className="w-full text-xl pl-5 h-[50px] border-[1px] border-solid border-slate-400 rounded-none outline-none focus:border-[#0B60B0] "
                    type="text"
                    name="acreage"
                    id="acreage"
                  />
                  <span className="absolute h-[50px] w-[70px] flex justify-center items-center bg-slate-200 right-0 top-0 border-l-0 border-[1px] border-solid border-slate-400">
                    m<sup>2</sup>
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-y-2 pb-5 ">
                <label className="text-slate-500" htmlFor="acreage">
                  Diện tích
                </label>
                <div className="relative">
                  <input
                    className="w-full text-xl pl-5 h-[50px] border-[1px] border-solid border-slate-400 rounded-none outline-none focus:border-[#0B60B0] "
                    type="text"
                    name="acreage"
                    id="acreage"
                  />
                  <span className="absolute h-[50px] w-[70px] flex justify-center items-center bg-slate-200 right-0 top-0 border-l-0 border-[1px] border-solid border-slate-400">
                    m<sup>2</sup>
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-y-2 pb-5 ">
                <label className="text-slate-500" htmlFor="floors">
                  Số tầng
                </label>
                <input
                  className="text-xl pl-5 h-[50px] border-[1px] border-solid border-slate-400 rounded-none outline-none focus:border-[#0B60B0] "
                  type="number"
                  name="floors"
                  id="floors"
                  min={0}
                  max={300}
                />
              </div>
              <div className="flex flex-col gap-y-2 pb-5">
                <label className="text-slate-500" htmlFor="postTitle">
                  Hướng
                </label>
                <select
                  id="direction"
                  className="h-[50px] border-[1px] border-solid border-slate-400 px-3 outline-none"
                >
                  <option value="east">Đông</option>
                  <option value="southeast">Đông Nam</option>
                  <option value="northeast">Đông Bắc</option>
                  <option value="northwest">Tây Bắc</option>
                  <option value="north">Bắc</option>
                  <option value="south">Nam</option>
                  <option value="southwest">Tây Nam</option>
                  <option value="west">Tây</option>
                </select>
              </div>
            </div>
            <div className="basis-1/2">
              <div className="flex flex-col gap-y-2 pb-5 ">
                <label className="text-slate-500" htmlFor="livingrooms">
                  Số phòng khách
                </label>
                <input
                  className="text-xl pl-5 h-[50px] border-[1px] border-solid border-slate-400 rounded-none outline-none focus:border-[#0B60B0] "
                  type="number"
                  name="livingrooms"
                  id="livingrooms"
                  min={0}
                  max={300}
                />
              </div>
              <div className="flex flex-col gap-y-2 pb-5 ">
                <label className="text-slate-500" htmlFor="bedrooms">
                  Số phòng ngủ
                </label>
                <input
                  className="text-xl pl-5 h-[50px] border-[1px] border-solid border-slate-400 rounded-none outline-none focus:border-[#0B60B0] "
                  type="number"
                  name="bedrooms"
                  id="bedrooms"
                  min={0}
                  max={300}
                />
              </div>
              <div className="flex flex-col gap-y-2 pb-5 ">
                <label className="text-slate-500" htmlFor="toilets">
                  Số toilet
                </label>
                <input
                  className="text-xl pl-5 h-[50px] border-[1px] border-solid border-slate-400 rounded-none outline-none focus:border-[#0B60B0] "
                  type="number"
                  name="toilets"
                  id="toilets"
                  min={0}
                  max={300}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full py-5">
          <p className="pb-5 text-xl">Chọn hình ảnh</p>
          <div>
            <label className="text-slate-500">Chọn ảnh tiêu đề</label>
            <div className="my-5 flex flex-col justify-center items-center w-4/5 h-[300px] mx-auto border-[1px] border-solid border-slate-400">
              <p> Kéo các ảnh vào đây</p> <input type="file" />
            </div>
          </div>
          <div className="mt-10">
            <label className="text-slate-500">Chọn các hình ảnh tài sản</label>
            <div className="my-5 flex flex-col justify-center items-center w-4/5 h-[300px] mx-auto border-[1px] border-solid border-slate-400">
              <p> Kéo các ảnh vào đây</p> <input type="file" />
            </div>
          </div>
        </div>
        <button className="self-center ml-1 text-white bg-[#0B60B0] h-[40px] px-5 w-[150px] hover:opacity-80">
          Đăng bài
        </button>
      </form>
    </div>
  );
};

export default Post;
