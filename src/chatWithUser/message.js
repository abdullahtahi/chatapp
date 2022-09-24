import { style } from "@mui/system";
import React from "react";
import "./Support.css";
import { format } from "timeago.js";
export default function Message({ own, allMessage }) {
  //   console.log(own, allMessage);
  return (
    <div className={own ? "message own" : "message"}>
      <p className="messageText">{allMessage.text}</p>

      <div className="messageBottom">{format(allMessage.createdAt)}</div>
    </div>
  );
}
