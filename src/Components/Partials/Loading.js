// import hooks
import React, { useContext } from "react";

// import library
import { SyncLoader } from "react-spinners";
import { AppContext } from "../../Context/AppContext";

const Loading = () => {
  const { showSpinner } = useContext(AppContext);
  return (
    showSpinner && (
      <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-[rgba(0,0,0,.8)] flex justify-center items-center">
        <SyncLoader color="#CC8C08" />
      </div>
    )
  );
};

export default Loading;
