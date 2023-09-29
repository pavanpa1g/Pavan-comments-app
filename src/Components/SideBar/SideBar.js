import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { toast, Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./sidebar.css";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { addSelectedChat, addSingleChatList } from "@/store/features/chatSlice";
import { baseUrl } from "@/utils/baseApi";
import Image from "next/image";

const data = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
];

const UsersLoading = () => {
  return (
    <div className="loading-chat-container overflow-scroll h-[90vh] pb-2 ">
      {data.map((item) => {
        return (
          <div
            key={item.id}
            className="flex border border-gray-400 p-3 rounded-lg mb-2 items-center justify-center animate-pulse bg-gray-200"
          >
            <div className=" bg-gray-500 rounded-[50%] w-[30px] h-[30px] animate-pulse mr-2 self-start"></div>
            <div className="w-full">
              <div className="w-full bg-gray-400 h-[20px] animate-pulse mb-1 rounded"></div>
              <div className="w-[60%] bg-gray-300 h-[20px] animate-pulse rounded"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const RenderUsers = ({ item, handleClick }) => {
  const { picture, name, email, _id } = item;

  return (
    <div
      className="rounded-lg p-2 flex chat-item-container mb-3"
      onClick={() => handleClick(_id)}
    >
      <Image
        src={picture}
        alt={name}
        width={40}
        height={40}
        className="w-[40px] h-[40px] rounded-[50%] mr-3"
      />
      <div>
        <h1 className="font-semibold font text-gray-600">
          {email.slice(0, 1).toUpperCase()}
          {email.slice(1)}
        </h1>
        <p className="text-gray-500">
          {name.slice(0, 1).toUpperCase()}
          {name.slice(1)}
        </p>
      </div>
    </div>
  );
};

const SideBar = ({ isOpen, setIsOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [chatListLoading, setChatListLoading] = useState(false);

  const dispatch = useDispatch();

  const chatsListSelector = useSelector((state) => state.chat.chatList);

  // Define your search function here
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchUsers = async () => {
    if (searchTerm.length < 3) {
      toast.warning("at least 3 words are required to search", {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
      return;
    }
    setChatListLoading(true);
    const url = `${baseUrl}/api/user?search=${searchTerm}`;

    const token = Cookies.get("jwt_token");

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        toast.error(response, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
        console.log(response);
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
    }
    setChatListLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchUsers();
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input element when the component mounts
    inputRef.current.focus();
    // Select the text in the input element
    inputRef.current.select();
    setSearchResults([]);
    setSearchTerm("");
  }, [isOpen]);

  const accessChat = async (userId) => {
    try {
      const config = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        },
        body: JSON.stringify({ userId }),
      };

      const url = `${baseUrl}/api/chat`;

      const response = await fetch(url, config);

      if (response.ok) {
        const data = await response.json();
        dispatch(addSelectedChat(data));
        if (!chatsListSelector.find((item) => item._id === data._id)) {
          dispatch(addSingleChatList(data.data));
        }
        setIsOpen(false);
      } else {
        console.log(response);
        toast.error("Error fetching the chat", {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
    }
  };

  return (
    <div className={`${isOpen ? "sidebar-bg-container" : ""}`}>
      <div className={`sidebar ${isOpen ? "open" : ""} pt-4 sm:pt-2`}>
        <ToastContainer />
        <div className="sidebar-header">
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <BiArrowBack />
          </button>
          <div className="search-box">
            <input
              type="search"
              placeholder="Search users"
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              autoFocus
              ref={inputRef}
            />
            <FaSearch onClick={handleSearchUsers} />
          </div>
        </div>
        <div className="sidebar-content">
          {chatListLoading ? (
            <UsersLoading />
          ) : (
            <>
              {searchResults.length > 0
                ? searchResults
                    .slice(0, 9)
                    .map((item) => (
                      <RenderUsers
                        key={item._id}
                        item={item}
                        handleClick={accessChat}
                      />
                    ))
                : ""}{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
