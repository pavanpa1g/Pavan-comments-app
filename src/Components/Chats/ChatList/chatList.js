import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { HiOutlinePlus } from "react-icons/hi";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  addChatsList,
  addSelectedChat,
  removeAllChatList,
} from "@/store/features/chatSlice";

import { Flip, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./chatlist.css";
import NewGroupModel from "@/Components/Models/NewGroupModel/NewGroupModel";
import { baseUrl } from "@/utils/baseApi";
import Image from "next/image";
import { Loader } from "@/Components/Loader";

const ChatList = ({ setIsOpen }) => {
  const [loggedInUser, serLoggedInUser] = useState({});
  const dispatch = useDispatch();
  const selectedChatSelector = useSelector((state) => state.chat.selectedChat);
  const chatsListSelector = useSelector((state) => state.chat.chatList);
  const [isGroupModel, setGroupModel] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const config = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
      };

      const url = `${baseUrl}/api/chat`;

      const response = await fetch(url, config);
      if (response.ok) {
        const data = await response.json();
        dispatch(removeAllChatList());
        dispatch(addChatsList(data));
      } else {
        const { message } = response.json();
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
        console.log(response);
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    serLoggedInUser(JSON.parse(localStorage.getItem("userData")));
    fetchChats();
  }, []);

  const smallScreenAndSelector = selectedChatSelector.data
    ? "small-screen"
    : "";

  const ChatItem = ({ item }) => {
    const { groupPicture, isGroupChat, users, chatName, latestMessage } = item;

    const oppositeUser = !isGroupChat
      ? users.filter((item) => item._id !== loggedInUser._id)
      : "";
    const oppUserName =
      !isGroupChat &&
      oppositeUser[0].email.slice(0, 1).toUpperCase() +
        oppositeUser[0].email.slice(1);

    const handleChatSelection = () => {
      dispatch(addSelectedChat({ data: item }));
    };

    const isEqualSelectedChat =
      selectedChatSelector.data && selectedChatSelector.data._id === item._id;

    return (
      <div
        className={`chat-item-bg-container flex items-center mb-2 rounded cursor-pointer ${
          isEqualSelectedChat ? "bg-violet-300" : "bg-white"
        }`}
        onClick={handleChatSelection}
      >
        <Image
          src={isGroupChat ? groupPicture : oppositeUser[0].picture}
          alt="profile"
          width={40}
          height={40}
          className="chat-list-image-logo  "
        />
        <div className="h-[40px] w-full items-center justify-center">
          <h1
            className={`text-gray-500 font-semibold text-sm text-[12px] ${
              isEqualSelectedChat ? "text-black" : ""
            }`}
          >
            {isGroupChat ? chatName : oppUserName}
          </h1>
          {latestMessage && (
            <p className="text-gray-500  text-xs">
              {latestMessage.content.slice(0, 20)}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`left-list-width-container   ${smallScreenAndSelector}  p-2 rounded-lg chat-list-bg-shadow `}
    >
      <NewGroupModel
        setGroupModel={setGroupModel}
        isGroupModel={isGroupModel}
      />
      <ToastContainer />
      <div className="flex items-center  mb-2 justify-between">
        <div className="w-full input-container flex items-center self-start ">
          <input
            type="search"
            onFocus={() => setIsOpen(true)}
            className="w-full input-search pl-2"
            placeholder="Search Users"
          />
          <FaSearch />
        </div>
        <button className="plus-button" onClick={() => setGroupModel(true)}>
          {}
          <HiOutlinePlus />
        </button>
      </div>

      {loading ? (
        <div className="chat-list-loader-container">
          <Loader />
        </div>
      ) : (
        <div className="chat-list-scroll-container">
          {chatsListSelector.map((item) => (
            <ChatItem key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
