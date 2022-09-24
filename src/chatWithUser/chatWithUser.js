import { Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./Support.css";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "timeago.js";
import axios from "axios";
import Message from "./message";
export default function ChatWithUser() {
  const { id } = useParams();
  const socket = useRef(io("ws://localhost:3002"));
  const { support } = useSelector((state) => state.Support);
  const FilterSupport = support.find(
    (e) => e?._id === "63243b85fed0158ebd845b68"
  );
  //   console.log(FilterSupport);
  const [showSupport, setShowSupport] = useState(FilterSupport);
  const [queryMessage, setQueryMessage] = useState("");
  //   const [queryReply, setQueryReply] = useState([]);
  const [message, setMessage] = useState("");
  const [arrivalMessage, setarrivalMessage] = useState([]);
  const [getOwnMessage, setGetOwnMessage] = useState([]);
  const [getSenderMessage, setGetSenderMessage] = useState([]);

  const dispatch = useDispatch();
  const getSupport = async () => {
    try {
      const resp = await axios.get("http://localhost:3001/api/support");
      dispatch({
        type: "SUPPORT_SUCCESS",
        payload: resp.data.data,
      });
      //   console.log(resp.data.data);
    } catch (error) {
      //   console.log(error);
      //   toast.error(error.response.data.message || error.message || error);
    }
  };
  const getAllMessage = async () => {
    const resp = await axios.get(
      "http://localhost:3001/api/message/6325fe9434c8f4b8532560e3"
    );
    setQueryMessage(resp?.data?.data);
  };

  const getMymessage = () => {
    const [...rest] = getSenderMessage;
    const [...rest_all] = getOwnMessage;
    queryMessage?.map((e) =>
      e?.sender === "631720c60a5b975a8ab9d506"
        ? rest_all.push({ text: e?.text, date: e?.createdAt })
        : rest.push({ text: e?.text, date: e?.createdAt })
    );
    // setGetOwnMessage(rest_all);
    // setGetSenderMessage(rest);
  };
  const handleSubmit = async () => {
    const body = {
      id: "6325fe9434c8f4b8532560e3",
      sender: "6318214db1b6f5c947a383af",
      text: message,
    };
    // console.log(body);

    socket.current.emit("sendMessage", {
      senderId: "6318214db1b6f5c947a383af",
      recieverId: "631720c60a5b975a8ab9d506",
      text: message,
    });
    const resp = await axios.post("http://localhost:3001/api/message", body);
    console.log(resp);
    setQueryMessage([...queryMessage, resp.data.data]);
  };
  useEffect(() => {
    socket.current.emit(
      "addUser",
      "6318214db1b6f5c947a383af",
      "631720c60a5b975a8ab9d506"
    );
    socket.current.on("getUser", (users) => {
      console.log(users);
    });

    socket.current.on("getMessage", (data) => {
      console.log("the data of the Message is", data);
      setarrivalMessage({
        sender: data?.senderId,
        text: data?.text,
        createdAt: Date.now(),
      });
    });

    console.log("the arrival message is", arrivalMessage);
    getSupport();
    getAllMessage();
  }, [arrivalMessage]);

  useEffect(() => {
    // arrivalMessage &&
    //   "6325fe9434c8f4b8532560e3"?.members.include(arrivalMessage.sender) &&
    setQueryMessage((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  return (
    <Grid container className="responsiveHandler">
      <Grid
        style={{
          padding: "1rem",
          //   width: "15px",
          background: "#e8e8e8",
          // minHeight: "80vh",
        }}
        item
        xs={12}
        sm={12}
        md={4}
        // sx={{ minWidth: { xs: "100%", sm: "100%", md: 0 } }}
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: "600",
            textAlign: "center",
            borderBottom: "3px solid white",
          }}
        >
          Query Name
        </Typography>

        <Typography
          sx={{
            m: 2,
            p: 5,
            border: "2px solid white",
            display: "flex",
            justifyContent: "center",
          }}
          onClick={getMymessage}
        >
          {FilterSupport?.queryName}
        </Typography>
      </Grid>
      <Grid
        style={{
          // marginLeft: { xs: 0, sm: 0, md: "0.8rem" },
          // marginLeft: "0.8rem",
          background: "#e8e8e8",
          minHeight: "60vh",
          overflowY: "scroll",
          position: "relative",
        }}
        sx={{
          mt: { xs: 4, sm: 4, md: 0 },
          marginLeft: { xs: 0, sm: 0, md: "0.8rem" },
          // minWidth: { xs: "100%", sm: "100%", md: 0 },
        }}
        xs={12}
        sm={12}
        md={7}
        item
      >
        {queryMessage.length === 0 || queryMessage.length === 0 ? (
          <h2 className="startConversion">Start the Conversation</h2>
        ) : (
          queryMessage.map((e) => (
            <Message
              allMessage={e}
              own={e?.sender === "6318214db1b6f5c947a383af"}
            />
          ))
        )}
      </Grid>

      <Grid
        item
        xs={4}
        sx={{
          md: { mr: 3 },
          visibility: { xs: "visible", sm: "visible", md: "hidden" },
          display: { xs: "none", sm: "none", md: "block" },
        }}
      >
        <TextField label="Enter a message" multiline rows={3} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={7}
        sx={
          {
            // minWidth: "100% ",
          }
        }
      >
        <TextField
          className="InputforMessage"
          sx={{ mt: 4, minWidth: { xs: "100%", sm: "100%", md: "100%" } }}
          onChange={(e) => setMessage(e.target.value)}
          label="Enter a message"
        />
        <Button onClick={handleSubmit}>Send</Button>
      </Grid>
    </Grid>
  );
}
