import React from "react";
import Comments from "../Comments";
import getFormattedDate from "@/utils/Datefunction";
import "./index.css";
import Image from "next/image";

const UserPost = ({ item, fromProfile }) => {
  const { postedBy, imageUrl, _id, createdAt, likedBy, likes, commentsCount } =
    item;
  const { name, email } = postedBy;

  return (
    <li className="flex flex-col gap-2 justify-center items-center   border-gray-500 px-4 py-2 rounded-lg image-container-comment">
      <div className="flex w-full items-center mb-1">
        <div className="bg-pink-400 w-6 h-6 rounded-full flex items-center justify-center mr-2">
          <h2 className="text-white font-semibold">
            {name.slice(0, 1).toUpperCase()}
          </h2>
        </div>
        <h2 className="text font-semibold">
          {name.slice(0, 1).toUpperCase()}
          {name.slice(1)}
        </h2>
        <p className="para">{getFormattedDate(createdAt)}</p>
      </div>
      <Image
        width={300}
        height={180}
        src={imageUrl}
        alt="logo"
        className="image hover:object-contain"
        loading="lazy"
      />
      <Comments
        image={imageUrl}
        // imageId={_id}
        username={name}
        email={email}
        _id={_id}
        likedBy={likedBy}
        likes={likes}
        commentsCount={commentsCount}
        fromProfile={fromProfile}
      />
    </li>
  );
};

export default UserPost;
