"use client";

import Header from "@/Components/Header";
import SideBar from "@/Components/SideBar/SideBar";
import React, { useState } from "react";

import "./chats.css";

import ChatList from "@/Components/Chats/ChatList/chatList";
import ChatsComponent from "@/Components/Chats/ChatsComponent/ChatsComponent";
import ProtectedRoute from "@/Components/ProtectedRoute";

const ChatPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white h-screen flex flex-col items-center w-screen">
      <Header />
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="w-full h-[100%] px-3 flex">
        {/* <div className="flex  justify-between "> */}
        <ChatList setIsOpen={setIsOpen} />
        <ChatsComponent />
        {/* </div> */}
      </div>
    </div>
  );
};

export default ChatPage;
