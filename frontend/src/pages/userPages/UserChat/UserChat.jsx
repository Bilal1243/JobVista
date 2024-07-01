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
import "./UserChat.css";
import { useSelector } from "react-redux";
import NavbarUi from "../../../components/Navbars/Navbar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { PROFILE_PATH } from "../../../Utils/URL";

import {
  useUserGetChatsMutation,
  useUserListConnectionsMutation,
  useUserCreateChatMutation,
  useUsersendMessageMutation,
  useUserGetMessagesMutation,
} from "../../../redux/userSlices/userApiSlice";
import {
  getSender,
  getSenderFull,
  truncateText,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  breakTextIntoLines,
} from "../../../components/ChatLogic";
import Lottie from "react-lottie";

import io from "socket.io-client";
const ENDPOINT = "http://localhost:4000"; 
var socket, selectedChatCompare;
import animationData from "../../../components/typing.json";
import Loader from "../../../components/Loader";
import EmojiPicker from "emoji-picker-react";
import ListSkeleton from "../../../components/ListSkeleton";
import ChatScreen from "../../../components/ChatScreens/ChatScreen";

export default function UserChat() {
  const { userData } = useSelector((state) => state.auth);

  const [rooms, setRooms] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [content, setContent] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [chats, setChats] = useState([]);
  const [isMessageLoading, setIsMessageLoading] = useState(true);
  const [isChatsLoading, setIsChatsLoadings] = useState(true);

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const [userGetChats] = useUserGetChatsMutation();
  const [userListConnections] = useUserListConnectionsMutation();
  const [userCreateChat] = useUserCreateChatMutation();
  const [usersendMessage] = useUsersendMessageMutation();
  const [userGetMessages] = useUserGetMessagesMutation();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await userGetChats({ userId: userData._id });
      response.data.length > 0 ? setRooms(response.data) : [];
      fetchConnections();
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchConnections = async () => {
    try {
      const responseConnections = await userListConnections({
        userId: userData._id,
      }).unwrap();
      setConnections(responseConnections);
      setIsChatsLoadings(false);
    } catch (error) {
      console.log(error?.data?.message);
    }
  };

  const createChat = async (receiverId) => {
    try {
      const response = await userCreateChat({
        receiverId: receiverId,
        userId: userData._id,
      }).unwrap();
      setSelectedRoom(response);
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  const handleSearching = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length === 0) {
      fetchChats(); // Assuming fetchChats is a function to fetch all chats
    } else {
      const filteredConnections = connections.filter((connection) => {
        const fullName =
          `${connection.user[0].firstName} ${connection.user[0].lastName}`.toLowerCase();
        return fullName.includes(searchTerm);
      });
      setConnections(filteredConnections);

      let filteredRooms;
      if (rooms !== null) {
        filteredRooms = rooms.filter((room) => {
          const sender = getSender(userData, room.users);
          if (sender) {
            const fullName = `${sender}`.toLowerCase();
            return fullName.includes(searchTerm);
          }
          return false;
        });
      }

      setRooms(filteredRooms);
    }
  };

  const fetchMessages = async () => {
    try {
      let res = await userGetMessages({ chatId: selectedRoom._id });
      if (res) {
        console.log("messages", res);
        setChats(res.data);
        setMessageSent(false);
        setIsMessageLoading(false);
        socket.emit("join chat", selectedRoom._id);
      }
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  const sendHandler = async () => {
    if (content === "") {
      toast.error("Message cannot be empty");
      return;
    }
    try {
      socket.emit("stop typing", selectedRoom._id);
      const responseFromApiCall = await usersendMessage({
        sender: userData._id,
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
    socket.emit("setup", userData);
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
    // eslint-disable-next-line
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
          fetchChats();
        }
      } else {
        setChats([...chats, newMessageRecieved]);
        fetchChats();
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

  const isMobile = window.innerWidth <= 767;

  return (
    <>
      <NavbarUi></NavbarUi>
      <div className="container" style={{ marginTop: "135px" }}>
        <div className="row">
          {selectedRoom && isMobile ? (
            <ChatScreen
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              userData={userData}
            ></ChatScreen>
          ) : (
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  {isChatsLoading ? (
                    <ListSkeleton></ListSkeleton>
                  ) : (
                    <>
                      <div style={{ width: "100%" }}>
                        <span
                          className="p-input-icon-left"
                          style={{ width: "inherit" }}
                        >
                          <i className="pi pi-search" />
                          <InputText
                            placeholder="Search user"
                            style={{ width: "inherit" }}
                            onChange={handleSearching}
                          />
                        </span>
                      </div>
                      <div className="mt-2">
                        {rooms.length > 0 ? (
                          <>
                            {rooms.map((chat, index) => (
                              <div
                                className="card"
                                style={{ cursor: "pointer" }}
                                key={index}
                                onClick={() => setSelectedRoom(chat)}
                              >
                                <div className="card-body d-flex align-items-center">
                                  <img
                                    src={
                                      getSenderFull(userData, chat.users)
                                        .profileImg
                                        ? PROFILE_PATH +
                                          getSenderFull(userData, chat.users)
                                            .profileImg
                                        : "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
                                    }
                                    alt=""
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: "50%",
                                      marginRight: "10px", // Add margin-right for spacing
                                    }}
                                  />
                                  <div className="details">
                                    <h6 className="mb-0">
                                      {!chat.isGroupChat
                                        ? getSender(userData, chat.users)
                                        : chat.chatName}
                                    </h6>
                                    <p className="mb-0">
                                      {chat.latestMessage &&
                                        `${
                                          chat.latestMessage.sender._id ===
                                          userData._id
                                            ? "you"
                                            : chat.latestMessage.sender
                                                .firstName +
                                              " " +
                                              chat.latestMessage.sender.lastName
                                        } : ${truncateText(
                                          chat.latestMessage.content
                                        )}`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {connections.map((connection, index) => (
                              <div
                                className="card"
                                style={{ cursor: "pointer" }}
                                key={index}
                                onClick={() =>
                                  createChat(connection.user[0]._id)
                                }
                              >
                                <div className="card-body d-flex align-items-center">
                                  <img
                                    src={
                                      connection.user[0].profileImg
                                        ? PROFILE_PATH +
                                          connection.user[0].profileImg
                                        : "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
                                    }
                                    alt=""
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: "50%",
                                      marginRight: "10px", // Add margin-right for spacing
                                    }}
                                  />
                                  <div className="details">
                                    <h6 className="mb-0">
                                      {connection.user[0].firstName}{" "}
                                      {connection.user[0].lastName}
                                    </h6>
                                    <p className="mb-0">say hi</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="col-lg-8 d-none d-md-block">
            {selectedRoom !== null ? (
              <>
                <MDBRow className="d-flex justify-content-center">
                  <MDBCard id="chat2" style={{ borderRadius: "15px" }}>
                    <MDBCardHeader className="d-flex align-items-center p-3">
                      <img
                        src={
                          getSenderFull(userData, selectedRoom.users).profileImg
                            ? PROFILE_PATH +
                              getSenderFull(userData, selectedRoom.users)
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
                        {getSenderFull(userData, selectedRoom.users).firstName}{" "}
                        {getSenderFull(userData, selectedRoom.users).lastName}
                      </h5>
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
                                chat.sender._id === userData._id
                                  ? "end"
                                  : "start"
                              } mb-2 pt-1`}
                            >
                              <div>
                                <p
                                  className={`small p-2 ${
                                    chat.sender._id === userData._id
                                      ? "me-3 text-white bg-primary rounded-3 user-message"
                                      : "ms-3 rounded-3 guide-message"
                                  }`}
                                  dangerouslySetInnerHTML={{
                                    __html: breakTextIntoLines(
                                      chat.content,
                                      12
                                    ),
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
                          userData.image
                            ? PROFILE_PATH + userData.image
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
        </div>
      </div>
    </>
  );
}
