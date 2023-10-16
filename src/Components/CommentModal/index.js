import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { BiCommentDetail } from "react-icons/bi";

import "./index.css";
import { Loader } from "../Loader";
import getFormattedDate from "../../utils/Datefunction";
import { useSelector } from "react-redux";
import { baseUrl } from "@/utils/baseApi";
import Image from "next/image";
import { AiOutlineReload } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { Flip, toast } from "react-toastify";
import { headers } from "../../../next.config";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const EachComment = ({ item, setComments }) => {
  const { _id, commentedBy, comment, createdAt, commentedOn } = item;
  const { name, picture } = commentedBy;
  const { postedBy } = commentedOn;

  const handleDeleteComment = async () => {
    const options = {
      method: "DELETE",
    };

    const url = `api/comment/${_id}`;

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        toast.success("Successfully deleted message", {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
        setComments((prev) => prev.filter((item) => item._id !== _id));
      } else {
        const { message } = data;
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
    }
  };

  const myId = JSON.parse(localStorage.getItem("userData"));
  return (
    <li key={_id} className="flex mb-3 list-item-comment">
      <div className="rounded-full flex justify-center items-center mr-3 w-[20px] h-[20px]">
        <Image
          src={picture}
          width={20}
          height={20}
          alt={name}
          className="rounded-full w-[20px] h-[20px] self-start"
        />
      </div>
      <div className="w-full">
        <div className="flex items-center  w-full pr-3">
          <h3 className="text-white username-under-line">
            {name.slice(0, 1).toUpperCase()}
            {name.slice(1)}
          </h3>
          <p className=" font-mono text-xs text-gray-400 ml-auto">
            {getFormattedDate(createdAt)}
          </p>
          {(commentedBy._id === myId._id || postedBy === myId._id) && (
            <button className="ml-2" onClick={handleDeleteComment}>
              <MdDeleteOutline
                size={14}
                style={{ color: "rgb(156 163 175)" }}
              />
            </button>
          )}
        </div>

        <p className="text-gray-300 comment-text">{comment}</p>
      </div>
    </li>
  );
};

export const CommentModal = ({ image, setCommentModal, imageId, username }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const userSelector = useSelector((state) => state.user.users.user);

  const fetchComments = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    setLoading(true);

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userSelector.token}`,
      },
    };
    try {
      const response = await fetch(`/api/comment/image/${imageId}`, options);
      const data = await response.json();
      if (response.ok) {
        setComments(data);
        setApiStatus(apiStatusConstants.success);
        setLoading(false);
      } else {
        const { message } = data;
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
        setApiStatus(apiStatusConstants.failure);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
      console.log("error", error);
      setApiStatus(apiStatusConstants.failure);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const renderFailureView = () => {
    return (
      <div className="flex justify-center h-1/2">
        <button className="flex flex-col items-center justify-center self-center">
          <AiOutlineReload size={30} />
          <span className="font-semibold retry-text">Retry</span>
        </button>
      </div>
    );
  };

  const renderSuccess = () => {
    return (
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
              <EachComment
                item={item}
                key={item.id}
                setComments={setComments}
              />
            ))}
          </ul>
        )}
      </>
    );
  };

  const renderInProgress = () => {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    );
  };

  const renderComments = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccess();
      case apiStatusConstants.inProgress:
        return renderInProgress();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="modal-bg-container flex justify-center items-center z-30 bg-black bg-opacity-70">
      <div className="image-container">
        <button
          onClick={() => setCommentModal(false)}
          className="ml-auto cross-button"
        >
          <RxCross2 style={{ color: "black" }} size={20} />
        </button>
        <div className="flex flex-col md:flex-row w-full h-full">
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
              <Image
                src={`${image}`}
                width={260}
                height={180}
                alt="image"
                className="modal-image "
              />
            </div>
          </div>
          <div className="w-full sm:border-l-2 border-white pt-2 pl-2 half-container">
            <h2 className="text-white ml-2 mt-2 font-semibold">Comments</h2>

            {renderComments()}
          </div>
        </div>
      </div>
    </div>
  );
};
