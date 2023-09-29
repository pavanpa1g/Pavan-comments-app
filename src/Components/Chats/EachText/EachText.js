import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const EachText = ({ item }) => {
  const userSelector = useSelector((state) => state.user.users.user);

  const { content, sender, chat } = item;

  const { picture, _id } = sender;
  const isSendByMe = userSelector._id == _id;

  return (
    <div
      className={`flex mb-2 ${
        !isSendByMe ? "ml-auto" : "mr-auto"
      }  self-start max-w-[50%]`}
    >
      {!isSendByMe && (
        <Image
          src={picture}
          alt="profile"
          width={16}
          height={16}
          className="w-[16px] h-[16px] rounded-[50%] mr-1"
        />
      )}
      <span
        className={`${
          sender._id === userSelector._id ? "bg-[#BEE3F8]" : "bg-[#B9F5D0]"
        }`}
      >
        {/* <h1>{}</h1> */}
        <p className="text-black text-xs">{content}</p>
      </span>
    </div>
  );
};

export default EachText;
