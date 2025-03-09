// 📦 Import hooks
import React, { useContext, useEffect, useRef, useState } from "react";

// 📦 Import icons
import { LuSendHorizonal } from "react-icons/lu";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoMdCloseCircleOutline } from "react-icons/io";

// 🌐 Import contexts
import { AppContext } from "../Context/AppContext";
import { ChatContext } from "../Context/ChatContext";

// 🔥 Import Firebase services
import { db } from "../FirebaseConfig/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// 📷 Import images
import user_icon from "../images/user_icon.png";

// 📦 Import libraries
import Transitions from "../Components/Partials/Transition";
import { sendMessage } from "../firebase-helpers";

// 🏷️ ChatBox component
const ChatBox = () => {
  const { session } = useContext(AppContext);
  const { data, dispatch } = useContext(ChatContext);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const scroll = useRef();

  // 📝 Handle chat selection
  const handleSelectChats = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  // 📝 Handle send message
  const handleSend = async () => {
    sendMessage(text, img, data, session); // 📦 sendMessage function imported from firebase-helpers.js file
    setText("");
    setImg(null);
  };

  // 📝 Handle send message on Enter key press
  const handleSendMessage = (e) => {
    e.key === "Enter" && handleSend();
  };

  // 📝 Handle image upload
  const handleUploadImage = (event) => {
    if (event.target.files.length > 0) {
      const url = URL.createObjectURL(event.target.files[0]);
      setImg({ localURL: url, details: event.target.files[0] });
    }
  };

  // 📝 Fetch chats
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", session.userId), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    session && getChats();
  }, [session]);

  // 📝 Fetch messages
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  // 📝 Scroll to the latest message
  useEffect(() => {
    scroll.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Transitions>
      <h1 className="w-full text-center text-xl sm:text-2xl font-md py-5">
        TRÒ CHUYỆN
      </h1>
      <div className="flex flex-col md:flex-row min-h-fit border-y-[1px] border-solid border-gray-300">
        {/* Sidebar */}
        <div className="md:w-1/5 w-full border-r border-gray-300 overflow-y-auto border-y-[1px] sm:border-y-[0px] border-y-solid border-y-slate-200">
          {chats &&
            Object.entries(chats)
              ?.sort((a, b) => b[1].date - a[1].date)
              .map((chat) => (
                <div
                  key={chat[0]}
                  onClick={() => handleSelectChats(chat[1].userInfo)}
                  className={`flex items-center px-4 py-3.5 cursor-pointer hover:bg-[#EAA613] hover:text-white transition-all text-md ${
                    data.user.userId === chat[1].userInfo.userId &&
                    "bg-[#EAA613] text-white"
                  }`}
                >
                  <img
                    src={
                      chat[1].userInfo.photoURL !== ""
                        ? chat[1].userInfo.photoURL
                        : user_icon
                    }
                    alt="user_avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-4">
                    <span className="block font-semibold">
                      {chat[1].userInfo.displayName}
                    </span>
                    <p className="text-sm text-gray-600">
                      {chat[1].lastMessage?.text}
                    </p>
                  </div>
                </div>
              ))}
        </div>

        {/* Chat */}
        <div className="md:w-4/5 w-full flex flex-col mt-5 sm:mt-0 text-md">
          {data.chatId === "null" ? (
            <div className="flex items-center justify-center h-[400px] sm:h-[500px]">
              <p className="text-gray-500">Hãy chọn một cuộc trò chuyện</p>
            </div>
          ) : (
            <div>
              {/* Partner */}
              <div className="flex items-center p-4 border-b border-gray-300">
                <img
                  src={
                    data.user.photoURL !== "" ? data.user.photoURL : user_icon
                  }
                  alt="user_avatar"
                  className="w-10 h-10 rounded-full"
                />
                <p className="ml-4 font-semibold">{data.user.displayName}</p>
              </div>

              {/* Messages */}
              <div
                ref={scroll}
                className="flex-1 overflow-y-auto p-4 bg-gray-50 h-[300px] sm:h-[500px]"
              >
                {messages.length < 1 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      Hãy đặt câu hỏi cho nhân viên hỗ trợ!
                    </p>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      className={`flex items-start gap-x-2 p-2 ${
                        m.senderId === session?.userId && "flex-row-reverse"
                      }`}
                      key={m.id}
                    >
                      <div
                        style={{
                          backgroundImage: `url("${
                            m.senderId === session?.userId
                              ? session?.photoURL === ""
                                ? user_icon
                                : session?.photoURL
                              : data.user.photoURL === ""
                              ? user_icon
                              : data.user.photoURL
                          }")`,
                        }}
                        className="w-12 h-12 rounded-full bg-center bg-cover"
                      ></div>
                      <div
                        className={`flex flex-col gap-y-4 ${
                          m.senderId === session?.userId
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div
                          className={`bg-white p-2 shadow-md rounded-xl ${
                            m.senderId === session?.userId
                              ? "rounded-br-none"
                              : "rounded-bl-none"
                          } max-w-[40%] min-w-fit`}
                        >
                          {m.text}
                        </div>
                        {m.img && (
                          <div className="max-w-[50%] h-fit border-4 border-solid border-white overflow-hidden rounded-lg">
                            <img
                              src={m.img}
                              alt="assets"
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="flex items-center p-4 border-t border-gray-300">
                <input
                  type="text"
                  onKeyDown={handleSendMessage}
                  placeholder="Nhập tin nhắn..."
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  className="flex-1 border border-gray-300 rounded-md p-2 outline-none focus:border-[#EAA613] focus:border-2"
                />
                <label htmlFor="file" className="ml-4 cursor-pointer">
                  <BiSolidImageAdd className="text-2xl text-gray-400" />
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="file"
                  onChange={(event) => handleUploadImage(event)}
                />
                <button
                  onClick={handleSend}
                  className="ml-4 text-2xl text-[#EAA613]"
                >
                  <LuSendHorizonal />
                </button>
              </div>
              {img && (
                <div className="relative w-[40%] h-fit rounded-lg overflow-hidden p-4">
                  <img
                    src={img.localURL}
                    alt="image_is_uploaded"
                    className="object-cover"
                  />
                  <button
                    onClick={() => setImg(null)}
                    className="absolute right-4 top-4 bg-white w-[30px] h-[30px] rounded-full text-xl"
                  >
                    <IoMdCloseCircleOutline />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Transitions>
  );
};

export default ChatBox;
