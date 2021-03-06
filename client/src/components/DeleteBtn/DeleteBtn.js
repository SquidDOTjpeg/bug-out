import React from "react";
import "./DeleteBtn.css";
import { PromiseProvider } from "mongoose";

function DeleteBtn(props) {
  return (
    <button
      onClick={() => {
        props.delete();
      }}
      type="button"
      className="DeleteBtn"
    >
      Delete Bug
    </button>
  );
}

export default DeleteBtn;
