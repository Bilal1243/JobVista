import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import "./ChatScreen.css";
import { useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { PROFILE_PATH } from "../../../Utils/URL";

import {
  useRecruiterGetChatsMutation,
  useRecruitersendMessageMutation,
  useRecruiterGetMessagesMutation,
  useRecruiterCreateChatMutation,
  useRecruiterListConnectionsMutation,
} from "../../../redux/recruiterSlices/recruiterApiSlices";

import {
  getSender,
  getSenderFull,
  truncateText,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  breakTextIntoLines,
} from "../../ChatLogic";

import Lottie from "react-lottie";

import io from "socket.io-client";
const ENDPOINT = "http://localhost:4000"; 
var socket, selectedChatCompare;
import animationData from "../../typing.json";
import Loader from "../../Loader";
import EmojiPicker from "emoji-picker-react";

function RecruiterChatScreen({ selectedRoom, setSelectedRoom }) {
  console.log(selectedRoom);
  const { recruiterData } = useSelector((state) => state.recruiterAuth);

  const [notifications, setNotifications] = useState([]);
  const [content, setContent] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [chats, setChats] = useState([]);

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(true);

  const [recruitersendMessage] = useRecruitersendMessageMutation();
  const [recruiterGetMessages] = useRecruiterGetMessagesMutation();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    try {
      let res = await recruiterGetMessages({ chatId: selectedRoom._id });

      if (res) {
        setChats(res.data);
        setMessageSent(false);
        socket.emit("join chat", selectedRoom._id);
        setIsMessageLoading(false);
      }
    } catch (error) {
      console.log(error?.data?.message);
    }
  };

  const sendHandler = async () => {
    if (content === "") {
      toast.error("Message cannot be empty");
      return;
    }
    try {
      socket.emit("stop typing", selectedRoom._id);
      const responseFromApiCall = await recruitersendMessage({
        sender: recruiterData._id,
        chatId: selectedRoom._id,
        content: content,
      });

      if (responseFromApiCall.data) {
        setContent("");
        setMessageSent(true);
        socket.emit("new message", responseFromApiCall.data);
        setChats([...chats, responseFromApiCall.data]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", recruiterData);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedRoom;
  }, [selectedRoom, messageSent]);

  useEffect(() => {
    const scrollToBottom = () => {
      const chatBody = document.getElementById("chat-body");
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    };

    scrollToBottom();
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notifications.includes(newMessageRecieved)) {
          const updatedNotifications = [newMessageRecieved, ...notifications];
          setNotifications(updatedNotifications);
        }
      } else {
        setChats([...chats, newMessageRecieved]);
        scrollToBottom();
      }
    });
  });

  const formatTime = (timestamp) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(timestamp).toLocaleTimeString("en-US", options);
  };

  const typingHandler = (e) => {
    setContent(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedRoom._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDifference = timeNow - lastTypingTime;

      if (timeDifference >= timerLength && typing) {
        socket.emit("stop typing", selectedRoom._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const emojiHandler = (emoji) => {
    setContent((prev) => prev + emoji.emoji);
  };
  return (
    <>
      <div className="col-lg-12">
        {selectedRoom !== null ? (
          <>
            <MDBRow className="d-flex justify-content-center">
              <MDBCard id="chat2" style={{ borderRadius: "15px" }}>
                <MDBCardHeader className="d-flex align-items-center justify-content-between p-3">
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        getSenderFull(recruiterData, selectedRoom.users)
                          .profileImg
                          ? PROFILE_PATH +
                            getSenderFull(recruiterData, selectedRoom.users)
                              .profileImg
                          : "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
                      }
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                    <h5 className="mb-0 ms-2">
                      {
                        getSenderFull(recruiterData, selectedRoom.users)
                          .firstName
                      }{" "}
                      {
                        getSenderFull(recruiterData, selectedRoom.users)
                          .lastName
                      }
                    </h5>
                  </div>
                  <Button onClick={() => setSelectedRoom(null)} outlined>
                    go back
                  </Button>
                </MDBCardHeader>

                {isMessageLoading ? (
                  <Loader></Loader>
                ) : (
                  <MDBCardBody
                    id="chat-body"
                    className="chat-body"
                    style={{
                      maxHeight: "400px", // Set the maximum height for the chat body
                      overflowY: "auto", // Enable vertical scrollbar
                    }}
                  >
                    {chats && chats.length > 0 ? (
                      chats.map((chat, index) => (
                        <div
                          key={index}
                          className={`d-flex flex-row justify-content-${
                            chat.sender._id === recruiterData._id
                              ? "end"
                              : "start"
                          } mb-2 pt-1`}
                        >
                          <div>
                            <p
                              className={`small p-2 ${
                                chat.sender._id === recruiterData._id
                                  ? "me-3 text-white bg-primary rounded-3 user-message"
                                  : "ms-3 rounded-3 guide-message"
                              }`}
                              dangerouslySetInnerHTML={{
                                __html: breakTextIntoLines(chat.content, 12),
                              }} // Use dangerouslySetInnerHTML to render the HTML with line breaks
                            ></p>
                            <p className="small text-muted m-0">
                              {formatTime(chat.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center">
                        No Chats
                      </div>
                    )}
                  </MDBCardBody>
                )}

                {isTyping ? (
                  <div>
                    <Lottie
                      options={defaultOptions}
                      // height={50}
                      width={70}
                      style={{ marginBottom: 10, marginLeft: 10 }}
                    />
                  </div>
                ) : (
                  <></>
                )}

                <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
                  <img
                    src={
                      recruiterData.image
                        ? PROFILE_PATH + recruiterData.image
                        : "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
                    }
                    alt=""
                    style={{
                      width: "50px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                  />
                  <input
                    type="text"
                    value={content}
                    class="form-control form-control-lg"
                    id="exampleFormControlInput1"
                    placeholder="Type message"
                    onChange={(e) => typingHandler(e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // Prevents a newline character from being inserted
                      }
                    }}
                    style={{ border: "none" }}
                  ></input>

                  <a
                    className="me-3 text-muted"
                    onClick={() => {
                      setEmojiPickerOpen(!isEmojiPickerOpen);
                    }}
                  >
                    <MDBIcon fas icon="smile" />
                  </a>
                  <div className="emoji d-flex">
                    {isEmojiPickerOpen && (
                      <EmojiPicker
                        onEmojiClick={emojiHandler}
                        className="emojiPicker"
                        style={{ zIndex: 2 }} // Set a higher z-index for the EmojiPicker
                      />
                    )}
                  </div>
                  <div className="w-1/12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => sendHandler()}
                    >
                      Send
                    </button>
                  </div>
                </MDBCardFooter>
              </MDBCard>
            </MDBRow>
          </>
        ) : (
          <>
            <MDBRow className="d-flex justify-content-center">
              <MDBCard id="chat2" style={{ borderRadius: "15px" }}>
                <MDBCardBody
                  id="chat-body"
                  className="chat-body"
                  style={{
                    maxHeight: "450px", // Set the maximum height for the chat body
                  }}
                >
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      src="https://png.pngtree.com/png-vector/20191105/ourmid/pngtree-sending-message-outline-icon-png-image_1959107.jpg"
                      alt=""
                    />
                  </div>
                  <h5 className="text-center">select any chat</h5>
                </MDBCardBody>
              </MDBCard>
            </MDBRow>
          </>
        )}
      </div>
    </>
  );
}

export default RecruiterChatScreen;
