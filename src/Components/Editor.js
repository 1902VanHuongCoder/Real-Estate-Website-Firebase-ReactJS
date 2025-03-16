// import hooks
import React from "react";

//import library
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Editor({ value, setValueEditor }) {
  return (
    <ReactQuill
      className={`text-2xl w-full min-h-[300px]`}
      theme="snow"
      value={value}
      onChange={setValueEditor}
    />
  );
}

export default Editor;
