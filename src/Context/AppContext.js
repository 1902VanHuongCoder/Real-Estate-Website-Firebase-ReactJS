import React, { useState } from "react";
import { createContext } from "react";
export const AppContext = createContext();
const AppProvider = ({ children }) => {

  const [sideBarOpen, setSideBarOpen] = useState(false); // state to store and control sidebar
  const [isOpenUserBox, setOpenUserBox] = useState(false); // state to store and control userbox
  const [showImage, setShowImage] = useState(false);  // toggle to view images in detail page
  const [component, setComponent] = useState(null); 
  const [session, setSession] = useState(null);
  const [showNotification, setShowNotification] = useState(null);
  const userInfo = {
    sideBarOpen: sideBarOpen,
    setSideBarOpen: setSideBarOpen,

    openUserBox: isOpenUserBox,
    setOpenUserBox: setOpenUserBox,

    showImage: showImage,
    setShowImage: setShowImage,

    component:component,
    setComponent: setComponent,

    session: session,
    setSession:setSession,

    showNotification: showNotification,
    setShowNotification: setShowNotification
  };

  return <AppContext.Provider value={userInfo}>{children}</AppContext.Provider>;
};

export default AppProvider;