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
    <div className="bg-white h-screen border-1 border-red-800 pb-2 sm:pb-5 p-5 flex flex-col items-center w-screen">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="w-full sm:w-[80%] h-[100%]">
        <Header />
        <div className="flex  justify-between  h-[94%]">
         <ChatList setIsOpen={setIsOpen} />
          <ChatsComponent />
        </div>
      </div>
    </div>
  );
};

export default  ()=>
<ProtectedRoute>
<ChatPage />
</ProtectedRoute> 
