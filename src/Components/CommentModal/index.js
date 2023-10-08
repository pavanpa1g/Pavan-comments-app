import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { BiCommentDetail } from "react-icons/bi";

import "./index.css";
import { Loader } from "../Loader";
import getFormattedDate from "../../utils/Datefunction";
import { useSelector } from "react-redux";
import { baseUrl } from "@/utils/baseApi";
import Image from "next/image";

const EachComment = ({ item }) => {
  const { _id, commentedBy, comment, createdAt } = item;
  const { name, picture } = commentedBy
  return (
    <li key={_id} className="flex mb-3 list-item-comment">
      <div className="rounded-full flex justify-center items-center mr-3 w-[20px] h-[20px]">
        <Image src={picture} width={20} height={20} alt={name} className="rounded-full w-[20px] h-[20px] self-start" />
      </div>
      <div className="w-full">
        <div className="flex items-center justify-between w-full pr-3">
          <h3 className="text-white username-under-line">
            {name.slice(0, 1).toUpperCase()}
            {name.slice(1)}
          </h3>
          <p className=" font-mono text-xs text-gray-400 ">{getFormattedDate(createdAt)}</p>
        </div>

        <p className="text-gray-300 comment-text">{comment}</p>
      </div>
    </li>
  );
};

export const CommentModal = ({ image, setCommentModal, imageId, username }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const userSelector = useSelector((state) => state.user.users.user);

  const getComments = async () => {
    setLoading(true);

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${userSelector.token}`
      },
    }
    try {
      const response = await fetch(
        `${baseUrl}/api/comment/${imageId}`, options
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className="modal-bg-container flex justify-center items-center z-30 bg-black bg-opacity-70">
      <div className="image-container">
        <button
          onClick={() => setCommentModal(false)}
          className="ml-auto cross-button"
        >
          <RxCross2 style={{ color: "black" }} size={20} />
        </button>
        <div className="flex flex-col sm:flex-row w-full h-full">
          <div className="w-full  flex flex-col items-center py-10 half-container">
            <div className="flex w-10/12 ">
              <div className="px-2 mr-2 bg-pink-400 rounded-full font-semibold text-yellow-900">
                <h2 className="font-extrabold">
                  {username.slice(0, 1).toUpperCase()}
                </h2>
              </div>
              <h1 className="w-80">
                {username.slice(0, 1).toUpperCase()}
                {username.slice(1)}
              </h1>
            </div>
            <div className="h-full flex justify-center items-center w-full">
              <Image src={`${image}`} width={260} height={180} alt="image" className="modal-image " />
            </div>
          </div>
          <div className="w-full sm:border-l-2 border-white pt-2 pl-2 half-container">
            <h2 className="text-white ml-2 mt-2 font-semibold">Comments</h2>
            {loading ? (
              <div className="flex items-center justify-center w-full h-full">
                <Loader />
              </div>
            ) : (
              <>
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <h1>No Comments Yet</h1>
                    <BiCommentDetail
                      style={{ color: "gray" }}
                      size={30}
                      className="mr-4"
                    />
                  </div>
                ) : (
                  <ul className="p-3 h-full  overflow-auto">
                    {comments.map((item) => (
                      <EachComment item={item} key={item.id} />
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
          {/* <div></div> */}
        </div>
      </div>
    </div>
  );
};
