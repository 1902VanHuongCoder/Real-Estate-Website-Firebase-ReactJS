import React, { useEffect, useState } from "react";
import { createContext } from "react";
export const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [sideBarOpen, setSideBarOpen] = useState(false); // state to store and control sidebar
  const [isOpenUserBox, setOpenUserBox] = useState(false); // state to store and control userbox
  const [showImage, setShowImage] = useState(false); // toggle to view images in detail page
  const [session, setSession] = useState(null);
  const [showNotification, setShowNotification] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [realEstateDetail, setRealEstateDetail] = useState(null);
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [news, setNews] = useState([]);
  const [showConfirmBox, setShowConfirmBox] = useState({
    show: false,
    content: "",
    dataToDelete: null,
    typeOfCollection: null,
  });

  console.log(showConfirmBox);
  
  const [houses, setHouses] = useState([]);
  const [lands, setLands] = useState([]);
  const [postsWasFiltered, setPostsWasFiltered] = useState([]);
  
  useEffect(() => {
    if (showNotification) {
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  }, [showNotification]);

  useEffect(() => {
    if (showCongratulation) {
      setTimeout(() => {
        setShowCongratulation(false);
      }, 5000);
    }
  }, [showCongratulation]);

  const userInfo = {
    showCongratulation: showCongratulation,
    setShowCongratulation: setShowCongratulation,

    sideBarOpen: sideBarOpen,
    setSideBarOpen: setSideBarOpen,

    openUserBox: isOpenUserBox,
    setOpenUserBox: setOpenUserBox,

    showImage: showImage,
    setShowImage: setShowImage,

    session: session,
    setSession: setSession,

    showNotification: showNotification,
    setShowNotification: setShowNotification,

    showSpinner: showSpinner,
    setShowSpinner: setShowSpinner,

    realEstateDetail: realEstateDetail,
    setRealEstateDetail: setRealEstateDetail,

    news: news,
    setNews: setNews,

    postsWasFiltered: postsWasFiltered,
    setPostsWasFiltered: setPostsWasFiltered,

    showConfirmBox: showConfirmBox,
    setShowConfirmBox: setShowConfirmBox,

    houses: houses,
    setHouses: setHouses,

    lands: lands,
    setLands: setLands,
  };

  return <AppContext.Provider value={userInfo}>{children}</AppContext.Provider>;
};

export default AppProvider;
