import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./chatscomponent.css";
import { MdSend } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { addChats, removeSelectedChat } from "@/store/features/chatSlice";
import Cookies from "js-cookie";
import NoMessages from "../NoMessages/NoMessages";

import {
  getToken,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "@/utils/ApiCallsAndLogics/logics";
import getFormattedDate from "@/utils/Datefunction";

import io from "socket.io-client";
// import Lottie from "react-lottie";
// import animationData from "../../../animations/typing.json";
import { baseUrl } from "@/utils/baseApi";
import Image from "next/image";
import { Loader } from "@/Components/Loader";
import FailureView from "@/Components/FailureView";

// const ENDPOINT = baseUrl;
const ENDPOINT =
  "https://pavangramnew-fqmb3upb6-pavangattu5-gmailcom.vercel.app/";
let socket, selectedChatCompare;

// const defaultOptions = {
//   loop: true,
//   autoplay: true,
//   animationData: animationData,
//   renderSettings: {
//     preserveAspectRatio: "xMidYMid slice",
//   },
// };

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const ChatsComponent = () => {
  const selectedChatSelector = useSelector((state) => state.chat.selectedChat);

  const smallScreenAndSelector = !selectedChatSelector.data
    ? "chats-small-screen"
    : "";

  const NoChatSelected = () => {
    return (
      <div className="noChatsSelected-container">
        <h1 className="text-gray-600 font-semibold">No Chat Selected</h1>
      </div>
    );
  };

  const SelectedChatContainer = () => {
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

    const chatContainerRef = useRef(null);

    const selectedChat = useSelector((state) => state.chat.selectedChat.data);
    const userSelector = useSelector((state) => state.user.users.user);
    const dispatch = useDispatch();

    const handleInputChange = (event) => {
      setNewMessage(event.target.value);

      //Typing Indicator Logic
      if (!socketConnected) return;

      if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }

      let lastTypingTime = new Date().getTime();

      let timerLength = 3000;

      setTimeout(() => {
        let timeNow = new Date().getTime();
        let timeDiff = timeNow - lastTypingTime;

        if (timeDiff >= timerLength && typing) {
          socket.emit("stop typing", selectedChat._id);
          setTyping(false);
        }
      }, timerLength);
    };

    const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

    // const { picture, name, email } = userSelector;

    const { _id, users, isGroupChat, groupPicture } = selectedChat;

    const userDataJson = JSON.parse(localStorage.getItem("userData"));
    const chatName = !isGroupChat
      ? users.filter((item) => item._id !== userDataJson._id)
      : "";
    const selectedUser = chatName[0];
    // const { name, email, picture } = selectedUser;

    const fetchSeparateChats = async () => {
      setLoading(true);
      setApiStatus(apiStatusConstants.inProgress);
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
      };
      const url = `/api/message/${_id}`;

      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setMessages(data);
          socket.emit("join chat", selectedChat._id);
          setApiStatus(apiStatusConstants.success);
        } else {
          console.log(response);
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.log(error);
        setApiStatus(apiStatusConstants.failure);
      }
      setLoading(false);
    };

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", userSelector);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
      fetchSeparateChats();

      selectedChatCompare = selectedChat;
    }, [selectedChatSelector]);

    useEffect(() => {
      socket.on("message received", (newMessageReceived) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessageReceived.chat._id
        ) {
          //give notification
        } else {
          setMessages([...messages, newMessageReceived]);
        }
      });
    });

    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const sendNewMessage = async () => {
      socket.emit("stop typing", selectedChat._id);
      const url = `/api/message/`;

      const userData = JSON.parse(localStorage.getItem("userData"));
      const options = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          content: newMessage,
          chatId: selectedChatSelector.data._id,
          currentUserId: userData._id,
        }),
      };
      try {
        const response = await fetch(url, options);

        if (response.ok) {
          const data = await response.json();

          socket.emit("new message", data);
          setMessages([...messages, data]);
          setNewMessage("");
        } else {
          console.log("response", response);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handelOnPressEnter = (event) => {
      if (event.key === "Enter" && newMessage) {
        sendNewMessage();
      }
    };

    const renderSuccess = () => {
      return (
        <>
          {messages.length > 0 ? (
            <div
              className="chats-container-style overflow-y-scroll"
              ref={chatContainerRef}
            >
              {messages.map((m, i) => {
                const currentUser = JSON.parse(
                  localStorage.getItem("userData")
                );
                const marginLeft = isSameSenderMargin(
                  messages,
                  m,
                  i,
                  currentUser._id
                );

                return (
                  <div key={m._id} className={`flex mb-auto`}>
                    {(isSameSender(messages, m, i, currentUser._id) ||
                      isLastMessage(messages, i, currentUser._id)) && (
                      <Image
                        src={m.sender?.picture}
                        width={25}
                        height={25}
                        alt="profile"
                        className="message-img-logo"
                      />
                    )}
                    <span
                      className={`${
                        m.sender?._id === currentUser._id
                          ? "current-user-bg-color"
                          : "other-user-bg-color"
                      } each-text-container `}
                      style={{
                        marginLeft: `${marginLeft}`,
                        marginTop: `${
                          isSameUser(messages, m, i, currentUser._id)
                            ? "3px"
                            : "10px"
                        }`,
                        overflowX: "hidden",
                      }}
                    >
                      <p>{m.content}</p>
                      <p className="text-gray-500 text-[8px] text-right">
                        {getFormattedDate(m.createdAt)}
                      </p>
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <NoMessages />
          )}
        </>
      );
    };

    const renderInProgress = () => {
      return (
        <div className="loader-container">
          <Loader />
        </div>
      );
    };

    const renderFailure = () => {
      const handleRetry = () => {
        fetchSeparateChats();
      };
      return (
        <div className="flex-1 flex justify-center">
          <FailureView handleRetry={handleRetry} />
        </div>
      );
    };

    const renderSeparateChats = () => {
      switch (apiStatus) {
        case apiStatusConstants.success:
          return renderSuccess();
        case apiStatusConstants.inProgress:
          return renderInProgress();
        case apiStatusConstants.failure:
          return renderFailure();
        default:
          return null;
      }
    };

    return (
      <div className="separate-chat-container">
        <div className="flex  items-center top-profile-container">
          <Image
            src={isGroupChat ? groupPicture : selectedUser.picture}
            alt="profile"
            width={40}
            height={40}
            className="image-logo"
          />
          <div>
            <h1 className="text-color font-semibold">
              {isGroupChat
                ? selectedChat.chatName
                : selectedUser.email.slice(0, 1).toUpperCase()}
              {!isGroupChat && selectedUser.email.slice(1)}
            </h1>
            {!isGroupChat && isTyping && (
              <p className="text-color ">Typing...</p>
            )}
          </div>
          <button onClick={() => dispatch(removeSelectedChat())}>
            <ImCross />
          </button>
        </div>

        {renderSeparateChats()}

        <div className="bottom-input-container">
          <div className="fixed-chat-container">
            <input
              type="text"
              value={newMessage}
              placeholder="Message"
              className="text-gray-700"
              onChange={handleInputChange}
              onKeyDown={handelOnPressEnter}
            />
          </div>
          <button className="send-button" onClick={sendNewMessage}>
            {/* <MdSend /> */}

            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              aria-hidden="true"
              class="text-white"
              height="18"
              width="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`right-list-width-container  ${smallScreenAndSelector}`}>
      {selectedChatSelector.data ? (
        <SelectedChatContainer />
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
};

export default ChatsComponent;
