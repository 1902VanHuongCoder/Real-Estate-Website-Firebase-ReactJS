// import hooks
import React, { useContext } from "react";
import { useNotification } from "../../Hooks/useNotification";

// import contexts
import { AppContext } from "../../Context/AppContext";

// import libraries
import { AnimatePresence, motion } from "framer-motion";

// import firebase services
import { db, storage } from "../../FirebaseConfig/firebase";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";

const confirmBoxVariants = {
  hidden: {
    scale: 0,
  },
  center: {
    scale: 1,
  },
};

const ConfirmBox = () => {
  const { showConfirmBox, setShowConfirmBox } = useContext(AppContext);
  const [handleShowNotification] = useNotification();
  const handleHiddenConfirmBox = () => {
    console.log("Cancle");
    setShowConfirmBox({
      show: false,
      content: "",
      dataToDelete: null,
      typeOfCollection: null,
    });
  };

  const handleConfirmDeleting = async () => {
    if (showConfirmBox.typeOfCollection === "posts") {
      // Create a reference to the file to delete
      const listImagesNeedToDelete =
        showConfirmBox.dataToDelete.besideImageURLs;
      listImagesNeedToDelete.push(showConfirmBox.dataToDelete.titleImageURL);

      for (let i = 0; i < listImagesNeedToDelete.length; i++) {
        const desertRef = ref(storage, listImagesNeedToDelete[i].imageURL);

        console.log(listImagesNeedToDelete[i]);

        // Delete the file
        deleteObject(desertRef)
          .then(() => {
            console.log("File was deleted successfully.");
          })
          .catch((error) => {
            console.log("Deleting file is failed.");
          });
      }
      try {
        await deleteDoc(doc(db, "posts", showConfirmBox.dataToDelete.id));
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
        deleteObject(desertRef)
          .then(() => {
            console.log("File was deleted successfully.");
          })
          .catch((error) => {
            console.log("Deleting file is failed.");
          });
      }

      if (showConfirmBox.dataToDelete.backgroundImageName !== "") {
        const desertRef = ref(
          storage,
          `userImages/${showConfirmBox.dataToDelete.backgroundImageName}`
        );
        deleteObject(desertRef)
          .then(() => {
            console.log("File was deleted successfully.");
          })
          .catch((error) => {
            console.log("Deleting file is failed.");
          });
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

    window.location.reload();
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
          <div className="relative w-[300px] h-[200px] bg-white">
            <p className="px-4 py-2 w-full text-center text-[#0B60B0] text-lg uppercase border-b-[1px] border-solid border-slate-200">
              Xác nhận
            </p>
            <p className="px-4 py-5">{showConfirmBox.content}</p>
            <div className="flex justify-end px-4 gap-x-6">
              <button onClick={handleHiddenConfirmBox} className="">
                Hủy
              </button>
              <button
                onClick={handleConfirmDeleting}
                className="border-solid border-[#0B60B0] border-[2px] rounded-md px-4 py-1"
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
