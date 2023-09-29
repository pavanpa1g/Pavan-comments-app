import React, { useState } from "react";
import Modal from "react-modal";
import { RxCross2 } from "react-icons/rx";

import "./groupmodel.css";
import Cookies from "js-cookie";
import { getToken } from "@/utils/ApiCallsAndLogics/logics";
import { useDispatch } from "react-redux";
import { addSingleChatList } from "@/store/features/chatSlice";
import { baseUrl } from "@/utils/baseApi";
import Image from "next/image";

const NewGroupModel = ({ isGroupModel, setGroupModel }) => {
  const [groupNameInput, setGroupNameInput] = useState("");
  const [userTextInput, setUserNameInput] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const dispatch = useDispatch();


  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const searchUsers = async () => {
    setLoading(true);
    const url = `${baseUrl}/api/user?search=${userTextInput}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt_token")}`,
      },
    };
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const data = await response.json();
        setSearchedUsers(data.slice(0, 10));
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setUserNameInput("");
  };

  const onAddToSelectedUsers = (user) => {
    const isIncluded = selectedUsers.findIndex((item) => item._id === user._id);
    if (isIncluded === -1) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      const newList = selectedUsers.filter((item) => item._id !== user._id);
      setSelectedUsers(newList);
    }
  };



  const UserItem = ({ item }) => {
    const { name, email, picture } = item;

    return (
      <div
        className="bg-gray-200 mb-2 rounded-lg flex items-center p-1 cursor-pointer"
        onClick={() => onAddToSelectedUsers(item)}
      >
        <Image
          src={picture}
          width={30}
          height={30}
          alt="profile"
          className="w-[30px] h-[30px] rounded-[50%] mr-2"
        />
        <div>
          <h1 className="text-black">
            {name.slice(0, 1).toUpperCase()}
            {name.slice(1)}
          </h1>
          <p className="text-black">
            <span className="font-semibold">Email: </span>
            {email}
          </p>
        </div>
      </div>
    );
  };

  const onClickEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      setSearchedUsers([]);
      searchUsers();
    }
  };

  const SelectedUserItem = ({ item }) => {
    const { name } = item;
    const removeSelectedUser = () => {
      const newList = selectedUsers.filter((user) => user._id !== item._id);
      setSelectedUsers(newList);
    };
    return (
      <li className="selected-user-container">
        <p className="para mr-1">{name}</p>
        <button onClick={removeSelectedUser}>
          <RxCross2 />
        </button>
      </li>
    );
  };

  const handleCreateNewGroup = async (event) => {
    event.preventDefault();

    const groupData = {
      users: JSON.stringify(selectedUsers.map((u) => u._id),),
      name:groupNameInput
    };

    console.log("groupData", groupData);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(groupData),
    };
    const url = `${baseUrl}/api/chat/group`;

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        dispatch(addSingleChatList(data));
        setGroupModel(false)

      } else {
        console.log("response", response);
      }
    } catch (error) {
      console.log(error);
      console.log("error", error.message);
    }
  };

  return (
    <Modal
      isOpen={isGroupModel}
      // onAfterOpen={afterOpenModal}
      //   onRequestClose={closeModal}
      // style={customStyles}
      className='custom-container'
      contentLabel="Example Modal"
    >
      <form
        className="bg-white group-model-container flex flex-col  rounded-xl "
        onSubmit={handleCreateNewGroup}
      >
        <button onClick={() => setGroupModel(false)}>
          <RxCross2 />
        </button>

        <h1 className="text-center text-black font-semibold">
          Create Group Chat
        </h1>
        <br />
        <input
          type="text"
          value={groupNameInput}
          placeholder="Add Group Name"
          className="input-model  pl-2  rounded-lg "
          onChange={(e) => setGroupNameInput(e.target.value)}
          required
        />
        <input
          type="search"
          value={userTextInput}
          placeholder="Add Users eg,Pavan, Ram "
          className="input-model px-2  rounded-lg"
          onChange={(e) => setUserNameInput(e.target.value)}
          onKeyDown={onClickEnter}
        />
        {loading && <p className="text-black text-center">Loading...</p>}
        {selectedUsers.length > 0 && (
          <ul className="flex mb-1 gap-1 selected-users-ul-container">
            {selectedUsers.map((item) => (
              <SelectedUserItem key={item._id} item={item} />
            ))}
          </ul>
        )}
        {searchedUsers.length > 0 && (
          <div className="searched-user-container mb-2">
            {searchedUsers.map((item) => (
              <UserItem key={item._id} item={item} />
            ))}
          </div>
        )}
        <button
          className="px-4 py-2 bg-blue-500 self-end rounded-lg"
          disabled={loading}
          type="submit"
        >
          Create Chat
        </button>
      </form>
    </Modal>
  );
};

export default NewGroupModel;
