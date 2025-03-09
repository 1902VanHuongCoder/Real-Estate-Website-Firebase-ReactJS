import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "./FirebaseConfig/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// 📦 Import libraries
import { v4 as uuid } from "uuid";

export const createNewChat = async (postData, session) => {
  try {
    const q = query(
      collection(db, "user_accounts"),
      where("userId", "==", postData.userId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      const combinedId =
        session.userId > userData.userId
          ? session.userId + userData.userId
          : userData.userId + session.userId;

      const chatDocRef = doc(db, "chats", combinedId);
      const userChatDocRef1 = doc(db, "userChats", session.userId);
      const userChatDocRef2 = doc(db, "userChats", userData.userId);

      try {
        const chatDoc = await getDoc(chatDocRef);
        if (!chatDoc.exists()) {
          // Create a chat in chats collection
          await setDoc(chatDocRef, { messages: [] });
        }

        // Ensure userChats documents exist before updating
        const userChatDoc1 = await getDoc(userChatDocRef1);
        if (!userChatDoc1.exists()) {
          await setDoc(userChatDocRef1, {});
        }

        const userChatDoc2 = await getDoc(userChatDocRef2);
        if (!userChatDoc2.exists()) {
          await setDoc(userChatDocRef2, {});
        }

        // Update user chats
        await updateDoc(userChatDocRef1, {
          [combinedId + ".userInfo"]: {
            userId: userData.userId,
            displayName: userData.username,
            photoURL: userData.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(userChatDocRef2, {
          [combinedId + ".userInfo"]: {
            userId: session.userId,
            displayName: session.username,
            photoURL: session.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      } catch (err) {
        console.log("ERROR", err);
      }
    } else {
      console.error("No such user document!");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const sendMessage = async (text, img, data, session) => {
  if (img) {
    const storageRef = ref(storage, "chatImages/" + img.details.name);
    const uploadTask = uploadBytesResumable(storageRef, img.details);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
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
};

export const fetchUserData = async (id) => {
  try {
    const docRef = doc(db, "user_accounts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData;
    } else {
      console.log("No such document!");
      return;
    }
  } catch (error) {
    console.log(error); // display error messages in console panel
    return;
  }
};
