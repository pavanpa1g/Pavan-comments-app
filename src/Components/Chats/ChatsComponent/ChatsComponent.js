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
} from "@/Components/apiCallsAndLogics/logics";
import getFormattedDate from "@/utils/Datefunction";

import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../../animations/typing.json";

const ENDPOINT = "https://pavangramnew-pavangattu5-gmailcom.vercel.app";
let socket, selectedChatCompare;

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  renderSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const ChatsComponent = () => {
  const selectedChatSelector = useSelector((state) => state.chat.selectedChat);

  const smallScreenAndSelector = !selectedChatSelector.data
    ? "chats-small-screen"
    : "";

  const NoChatSelected = () => {
    return (
      <div className="flex items-center justify-center h-[100%] w-[100%]">
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
      const url = `http://localhost:3001/api/message/${_id}`;

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
      const url = "http://localhost:3001/api/message/";

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
      <div className="h-[100%] flex  flex-col relative box-border">
        <div className="flex py-1 items-center top-profile-container">
          <img
            src={isGroupChat ? groupPicture : selectedUser.picture}
            alt="profile"
            className="rounded-[50%] w-[40px] h-[40px] mr-3"
          />
          <div>
            <h1 className="text-gray-800 font-semibold">
              {isGroupChat
                ? selectedChat.chatName
                : selectedUser.email.slice(0, 1).toUpperCase()}
              {!isGroupChat && selectedUser.email.slice(1)}
            </h1>
            {!isGroupChat && (
              <p className="text-gray-800 ">
                {selectedUser.name.slice(0, 1).toUpperCase()}
                {selectedUser.name.slice(1)}
              </p>
            )}
          </div>
          <button onClick={() => dispatch(removeSelectedChat())}>
            <ImCross />
          </button>
        </div>

        {messages.length > 0 ? (
          <div
            className="bg-gray-100 border-2 border-red-500 flex-1 rounded-xl mb-1 pt-2 px-1 overflow-y-scroll "
            ref={chatContainerRef}
          >
            {messages.map((m, i) => {
              console.log(m);
              console.log(m.sender._id === userSelector._id);
              const marginLeft = isSameSenderMargin(
                messages,
                m,
                i,
                userSelector._id
              );
              return (
                // <EachText key={item._id} item={item} />
                <div key={m._id} className={`flex mb-auto`}>
                  {(isSameSender(messages, m, i, userSelector._id) ||
                    isLastMessage(messages, i, userSelector._id)) && (
                    <img
                      src={m.sender.picture}
                      alt="profile"
                      className="mt-[7px] mr-1 w-[25px] h-[25px] rounded-[50%]"
                    />
                  )}
                  <span
                    className={`${
                      m.sender._id === userSelector._id
                        ? "bg-[#b9f5d0]"
                        : "bg-[#bee3f8]"
                    } rounded-[12px] py-[5px] px-[15px] max-w-[75%] text-black  `}
                    style={{
                      marginLeft: `${marginLeft}`,
                      marginTop: `${
                        isSameUser(messages, m, i, userSelector._id)
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
                    {isTyping ? (
          <div>
            <Lottie
              options={defaultOptions}
              width={70}
              style={{}}
            />
          </div>
        ) : (
          <></>
        )}
          </div>
        ) : (
          <NoMessages />
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
      className={`right-list-width-container rounded-lg h-[100%] p-2 ${smallScreenAndSelector} left-container-chat-list h-full`}
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
