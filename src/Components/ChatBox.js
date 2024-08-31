// import hooks
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNotification } from "../Hooks/useNotification";

// import icons
import { LuSendHorizonal } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { BiSolidImageAdd } from "react-icons/bi";

//import contexts
import { AppContext } from "../Context/AppContext";
import { ChatContext } from "../Context/ChatContext";

//import firebase services
import { db, storage } from "../FirebaseConfig/firebase";
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// import images
import logo from "../images/logo.png";
import user_icon from "../images/user_icon.png";

// import libraries
import { v4 as uuid } from "uuid";
import Transitions from "../Components/Partials/Transition";
import { useLocation } from "react-router-dom";

const ChatBox = () => {
  const { session } = useContext(AppContext);

  const { state } = useLocation();

  const { data } = useContext(ChatContext);

  const [user, setUser] = useState(null);

  const [chats, setChats] = useState([]);

  console.log(chats);

  const [username, setUsername] = useState("");

  const [err, setErr] = useState(false);

  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");

  const [img, setImg] = useState(null);

  const { dispatch } = useContext(ChatContext);

  
  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      session.userId > user.userId
        ? session.userId + user.userId
        : user.userId + session.userId;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      console.log(!res.exists());

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        //create user chats
        console.log("Testing is running...");
        await updateDoc(doc(db, "userChats", session.userId), {
          [combinedId + ".userInfo"]: {
            userId: user.userId,
            displayName: user.username,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", user.userId), {
          [combinedId + ".userInfo"]: {
            userId: session.userId,
            displayName: session.username,
            photoURL: session.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log("ERROR");
    }
    setUser(null);
    setUsername("");
  };

  const handleSearch = async () => {
    const q = query(
      collection(db, "user_accounts"),
      where("username", "==", username)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelectChats = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, "chatImages/" + img.details.name);

      const uploadTask = uploadBytesResumable(storageRef, img.details);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              return;
          }
        },

        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: session.userId,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else if (text !== "") {
      try {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: session.userId,
            date: Timestamp.now(),
          }),
        });
      } catch (error) {
        console.log("Update chat was failed!");
      }
    }
    try {
      await updateDoc(doc(db, "userChats", session.userId), {
        [data.chatId + ".lastMessage"]: {
          text: img ? "Hình ảnh" : text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    } catch (error) {
      console.log("Update" + session.username + "was failed!");
    }

    try {
      await updateDoc(doc(db, "userChats", data.user.userId), {
        [data.chatId + ".lastMessage"]: {
          text: img ? "Hình ảnh" : text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    } catch (error) {
      console.log("Update" + session.username + "was failed!");
    }

    setText("");
    setImg(null);
  };
  const handleSendMessage = (e) => {
    e.key === "Enter" && handleSend();
  };

  const handleUploadImage = (event) => {
    if (event.target.files.length > 0) {
      const url = URL.createObjectURL(event.target.files[0]);
      setImg({ localURL: url, details: event.target.files[0] });
    }
  };

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

  const handleFetchData = async () => {
    if (state) {
      const q = query(
        collection(db, "user_accounts"),
        where("userId", "==", state)
      );
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } catch (err) {
        setErr(true);
      }
    }
  };
  useEffect(() => {
    state && handleFetchData();
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  const scroll = useRef();

  useEffect(() => {
    scroll.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Transitions>
      <h1 className="w-full text-center text-xl sm:text-4xl font-md pt-10 mb-16">
        <span className="border-b-[5px] border-solid border-[#0B60B0] pb-2">
          TRÒ CHUYỆN
        </span>
      </h1>
      <div
        className={`w-full flex border-[1px] border-solid border-slate-200 shadow-md text-black overflow-hidden mb-10`}
      >
        <div
          className={`basis-[35%] h-[${
            img ? "860px" : "640px"
          }] border-r-[1px] border-r-solid border-r-slate-200 flex flex-col items-center`}
        >
          <div className="h-fit w-full flex justify-center items-center">
            <img src={logo} alt="logo" className="w-[40%]" />
          </div>

          <div className="flex items-center w-full justify-center mb-5 gap-x-2 p-4">
            <input
              onKeyUp={handleKey}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="outline-none border-[2px] border-solid border-slate-200 rounded-sm p-2 w-[80%]"
              type="text"
              placeholder="Nhập tên..."
            />
            <span
              onClick={handleSearch}
              className="cursor-pointer hover:text-[#40a2d8]"
            >
              <FiSearch />
            </span>
          </div>

          {err && <div className="mb-5">Không tìm thấy người dùng</div>}

          <div className="flex flex-col w-full border-[1px] border-solid border-slate-200 bg-[#40a2d8] text-white px-5 hover:opacity-80">
            {user && (
              <div
                className="flex items-center gap-x-2 p-2 cursor-pointer"
                onClick={handleSelect}
              >
                <div
                  className="h-[40px] w-[40px] bg-white rounded-full bg-center bg-cover"
                  style={{
                    backgroundImage: `url('${
                      user.photoURL !== "" ? user.photoURL : user_icon
                    }')`,
                  }}
                ></div>
                <p>{user.username}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col w-full overflow-auto">
            {chats &&
              Object.entries(chats)
                ?.sort((a, b) => b[1].date - a[1].date)
                .map((chat) => (
                  <div
                    className={`w-full flex gap-2 items-center hover:bg-slate-200 rounded-sm cursor-pointer transition-all p-5 ${
                      chat[0] === data.chatId && "bg-slate-200"
                    }`}
                    key={chat[0]}
                    onClick={() => handleSelectChats(chat[1].userInfo)}
                  >
                    <div className="w-[40px] h-[40px] overflow-hidden rounded-full">
                      <img
                        src={
                          chat[1].userInfo.photoURL !== ""
                            ? chat[1].userInfo.photoURL
                            : user_icon
                        }
                        alt="user_avatar"
                      />
                    </div>
                    <div className="w-full">
                      <span className="font-bold">
                        {chat[1].userInfo.displayName}
                      </span>
                      <p className="w-full overflow-hidden max-h-[25px]">
                        {chat[1].lastMessage?.text}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Chat */}

        {data.chatId === "null" ? (
          <div className="basis-[65%] flex-col relative">
            <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] uppercase font-bold text-[#0B60B0] w-full text-center">
              Hãy chọn một cuộc trò chuyện
            </p>
          </div>
        ) : (
          <div
            className={`h-[${img ? "860px" : "640px"}]  basis-[65%] flex-col]`}
          >
            <div className="h-[70px] w-full bg-[#40a2d8] shadow-2xl">
              {/* Partner */}
              <div className="flex items-center h-full w-full px-2 gap-x-2">
                <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
                  <img
                    src={
                      data.user.photoURL !== "" ? data.user.photoURL : user_icon
                    }
                    alt="user_avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-white">{data.user.displayName}</p>
              </div>
            </div>

            <div
              ref={scroll}
              className="h-[500px] w-full bg-slate-100 overflow-auto px-4"
            >
              {messages.length < 1 ? (
                <div className="w-full h-full flex justify-center items-center text-xl">
                  <p>Hãy đặt câu hỏi cho nhân viên hỗ trợ!</p>
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
                      className="min-w-[50px] h-[50px] rounded-full bg-center bg-cover"
                    ></div>
                    <div
                      className={`flex flex-col gap-y-4  ${
                        m.senderId === session?.userId
                          ? "items-end"
                          : "items-start"
                      } `}
                    >
                      <div
                        className={`bg-white p-2 rounded-xl ${
                          m.senderId === session?.userId
                            ? "rounded-br-none"
                            : "rounded-bl-none"
                        } max-w-[40%] min-w-fit`}
                      >
                        {m.text}
                      </div>
                      {m.img && (
                        <div
                          className={`max-w-[50%] h-fit border-[4px] border-solid border-white overflow-hidden rounded-lg `}
                        >
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

            <div className="h-[70px] w-full flex gap-x-4 items-center px-4">
              <input
                type="text"
                onKeyDown={handleSendMessage}
                placeholder="Nhập tin nhắn..."
                onChange={(e) => setText(e.target.value)}
                value={text}
                className="border-[1px] border-solid border-slate-200 w-[90%] h-[50px] p-2 outline-none rounded-md"
              />

              <label htmlFor="file">
                <span className="text-2xl text-slate-400">
                  <BiSolidImageAdd />
                </span>
              </label>
              <span onClick={handleSend} className="text-2xl">
                <LuSendHorizonal />
              </span>
              <input
                type="file"
                style={{ display: "none" }}
                id="file"
                onChange={(event) => handleUploadImage(event)}
              />
            </div>
            {img && (
              <div className="relative w-[40%] h-[200px] rounded-lg overflow-hidden p-4">
                <img
                  src={img.localURL}
                  alt="image_is_uploaded"
                  className="object-cover"
                />
                <button
                  onClick={() => setImg(null)}
                  className="absolute right-4 top-4 bg-white w-[30px] h-[30px] rounded-full text-sm"
                >
                  X
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Transitions>
  );
};
export default ChatBox;
