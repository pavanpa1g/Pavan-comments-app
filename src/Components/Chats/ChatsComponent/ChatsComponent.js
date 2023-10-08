import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./chatscomponent.css";
import { MdSend } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { addChats, removeSelectedChat } from "@/store/features/chatSlice";
import Cookies from "js-cookie";
import NoMessages from "../NoMessages/NoMessages";
import EachText from "../EachText/EachText";
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

const ENDPOINT = baseUrl;
let socket, selectedChatCompare;

// const defaultOptions = {
//   loop: true,
//   autoplay: true,
//   animationData: animationData,
//   renderSettings: {
//     preserveAspectRatio: "xMidYMid slice",
//   },
// };

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
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
      };
      const url = `${baseUrl}/api/message/${_id}`;

      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);

          socket.emit("join chat", selectedChat._id);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.log(error);
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
      const url = `${baseUrl}/api/message/`;

      const options = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          content: newMessage,
          chatId: selectedChatSelector.data._id,
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

    return (
      <div className="separate-chat-container">
        <div className="flex py-1 items-center top-profile-container">
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
              <p className="text-color ">
                Typing...
              </p>
            )}
          </div>
          <button onClick={() => dispatch(removeSelectedChat())}>
            <ImCross />
          </button>
        </div>

        {loading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : (
          <>
            {" "}
            {messages.length > 0 ? (
              <div className="chats-container-style" ref={chatContainerRef}>
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
                    // <EachText key={item._id} item={item} />
                    <div key={m._id} className={`flex mb-auto`}>
                      {(isSameSender(messages, m, i, currentUser._id) ||
                        isLastMessage(messages, i, currentUser._id)) && (
                          <Image
                            src={m.sender.picture}
                            width={25}
                            height={25}
                            alt="profile"
                            className="message-img-logo"
                          />
                        )}
                      <span
                        className={`${m.sender._id === currentUser._id
                          ? "current-user-bg-color"
                          : "other-user-bg-color"
                          } each-text-container `}
                        style={{
                          marginLeft: `${marginLeft}`,
                          marginTop: `${isSameUser(messages, m, i, currentUser._id)
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
                {/* {isTyping ? (
                  <div>

                  </div>
                ) : (
                  <></>
                )} */}
              </div>
            ) : (
              <NoMessages />
            )}
          </>
        )}

        <div className="fixed-chat-container ">
          <input
            type="text"
            value={newMessage}
            placeholder="Message"
            className="text-gray-700"
            onChange={handleInputChange}
            onKeyDown={handelOnPressEnter}
          />
          <button className="send-button" onClick={sendNewMessage}>
            <MdSend />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`right-list-width-container  ${smallScreenAndSelector} left-container-chat-list h-full`}
    >
      {selectedChatSelector.data ? (
        <SelectedChatContainer />
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
};

export default ChatsComponent;
