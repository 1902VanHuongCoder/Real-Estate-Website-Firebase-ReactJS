// 📦 Import hooks
import React, { useContext } from "react";
import { useNotification } from "../../Hooks/useNotification";

// 📦 Import contexts
import { AppContext } from "../../Context/AppContext";

// 📦 Import libraries
import { AnimatePresence, motion } from "framer-motion";

// 🔥 Import firebase services
import { db, storage } from "../../FirebaseConfig/firebase";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";

// 🎨 Animation variants
const confirmBoxVariants = {
  hidden: {
    scale: 0,
  },
  center: {
    scale: 1,
  },
};

// 🏷️ ConfirmBox component
const ConfirmBox = () => {
  const { showConfirmBox, setShowConfirmBox } = useContext(AppContext);
  const [handleShowNotification] = useNotification();

  // 📝 Handle hiding the confirm box
  const handleHiddenConfirmBox = () => {
    setShowConfirmBox({
      show: false,
      content: "",
      dataToDelete: null,
      typeOfCollection: null,
    });
  };

  // 📝 Handle confirming the deletion
  const handleConfirmDeleting = async () => {
    if (showConfirmBox.typeOfCollection === "posts") {
      // Create a reference to the file to delete
      const listImagesNeedToDelete =
        showConfirmBox.dataToDelete.besideImageURLs;

      const newImagesToDeleteList = [];
      listImagesNeedToDelete.forEach((i) =>
        newImagesToDeleteList.push(i.imageURL)
      );

      newImagesToDeleteList.push(
        showConfirmBox.dataToDelete.titleImageURL.imageURL
      );

      console.log(newImagesToDeleteList);

      for (let i = 0; i < newImagesToDeleteList.length; i++) {
        try {
          const desertRef = ref(storage, newImagesToDeleteList[i]);
          await deleteObject(desertRef);
          console.log("File was deleted successfully.");
        } catch (error) {
          if (error.code === "storage/object-not-found") {
            console.log("File not found, skipping deletion.");
          } else {
            console.log("Deleting file failed.", error);
          }
        }
      }

      try {
        if (showConfirmBox.dataToDelete.house) {
          await deleteDoc(doc(db, "houses", showConfirmBox.dataToDelete.id));
        } else {
          await deleteDoc(doc(db, "lands", showConfirmBox.dataToDelete.id));
        }
        handleShowNotification("Xóa bài đăng thành công.");
      } catch (e) {
        handleShowNotification("Xóa bài đăng thất bại do mạng không ổn định");
        console.log(e);
      }
    }

    if (showConfirmBox.typeOfCollection === "user_accounts") {
      console.log("Delete Account");
      if (showConfirmBox.dataToDelete.photoName !== "") {
        const desertRef = ref(
          storage,
          `userImages/${showConfirmBox.dataToDelete.photoName}`
        );
        try {
          await deleteObject(desertRef);
          console.log("File was deleted successfully.");
        } catch (error) {
          if (error.code === "storage/object-not-found") {
            console.log("File not found, skipping deletion.");
          } else {
            console.log("Deleting file failed.", error);
          }
        }
      }

      if (showConfirmBox.dataToDelete.backgroundImageName !== "") {
        const desertRef = ref(
          storage,
          `userImages/${showConfirmBox.dataToDelete.backgroundImageName}`
        );
        try {
          await deleteObject(desertRef);
          console.log("File was deleted successfully.");
        } catch (error) {
          if (error.code === "storage/object-not-found") {
            console.log("File not found, skipping deletion.");
          } else {
            console.log("Deleting file failed.", error);
          }
        }
      }

      console.log(showConfirmBox.dataToDelete.id);
      try {
        await deleteDoc(
          doc(db, "user_accounts", showConfirmBox.dataToDelete.id)
        );
        handleShowNotification("Xóa tài khoản người dùng thành công.");
      } catch (e) {
        handleShowNotification(
          "Xóa tài khoản người dùng thất bại do mạng không ổn định"
        );
        console.log(e);
      }
    }

    setShowConfirmBox({
      ...showConfirmBox,
      show: false,
      dataToDelete: null,
      typeOfCollection: null,
    });

    // window.location.reload();
  };

  return (
    <AnimatePresence initial={false}>
      {showConfirmBox.show && (
        <motion.div
          variants={confirmBoxVariants}
          initial="hidden"
          animate="center"
          exit="hidden"
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: "center" }}
          className="fixed h-screen w-screen bg-[rgba(0,0,0,.5)] z-50 flex justify-center items-center"
        >
          <div className="relative w-[300px] h-[200px] bg-white rounded-md">
            <p className="px-4 py-2 w-full text-center text-[#CC8C08] text-lg uppercase border-b-[1px] border-solid border-slate-200">
              Xác nhận
            </p>
            <p className="px-4 py-5">{showConfirmBox.content}</p>
            <div className="flex justify-end px-4 gap-x-6">
              <button
                onClick={handleHiddenConfirmBox}
                className="text-[#CC8C08] border-solid border-[#CC8C08] border-[2px] rounded-md px-4 py-1 hover:bg-[#CC8C08] hover:text-white"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDeleting}
                className="text-white bg-[#CC8C08] border-solid border-[#CC8C08] border-[2px] rounded-md px-4 py-1 hover:opacity-80"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmBox;
