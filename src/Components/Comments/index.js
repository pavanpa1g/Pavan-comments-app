import React, { useState, useEffect, use } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { CommentModal } from "../CommentModal";

import "./index.css";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCommentsCountOnPost,
  updateLikeOnPost,
} from "@/store/features/postSlice";

import { Flip, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "@/utils/baseApi";
import {
  updateCommentsCountOnMyPost,
  updateLikeOnMyPost,
} from "@/store/features/myPostSlice";

const Comments = ({
  image,
  username,
  _id,
  likedBy,
  likes,
  commentsCount,
  fromProfile,
}) => {
  const [comment, setComment] = useState("");
  const [commentModal, setCommentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const userSelector = useSelector((state) => state.user.users.user);

  const postComment = async () => {
    setLoading(true);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON content type
        Authorization: `Bearer ${userSelector.token}`,
      },
      body: JSON.stringify({ comment, imageId: _id }), // Pass the URL directly without `${}`
    };

    try {
      const response = await fetch(`/api/image/comment`, options);
      if (response.ok) {
        const data = await response.json();
        const { fullComment } = data;
        const { commentedOn } = fullComment;

        dispatch(
          fromProfile
            ? updateCommentsCountOnPost(commentedOn)
            : updateCommentsCountOnMyPost(commentedOn)
        );

        toast.success("Successfully Commented", {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });

        setComment("");
      } else {
        setLoading(false);
        const { data } = await response.json();
        const { message } = data;
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }

    setLoading(false);
  };

  const handleLike = async () => {
    const url = `/api/image/like/${_id}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt_token")}`,
      },
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        dispatch(
          fromProfile ? updateLikeOnPost(data) : updateLikeOnMyPost(data)
        );
      } else {
        toast.error(data.message, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
        console.log("likesresponse", response);
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
      console.log("likeserror", error);
    }
  };

  const likedByMe = likedBy.findIndex((item) => item._id === userSelector._id);

  return (
    <>
      {commentModal ? (
        <CommentModal
          image={image}
          setCommentModal={setCommentModal}
          imageId={_id}
          username={username}
        />
      ) : (
        <div className="mb-4 mt-4 w-full">
          <div className="flex  items-center mb-1">
            <label className="comment-label">Comment:</label>
            <div className="counts-container">
              <button onClick={handleLike} className="like-icon-container">
                {likedByMe === -1 || likedBy.includes(userSelector._id) ? (
                  <AiOutlineHeart style={{ color: "gray" }} size={24} />
                ) : (
                  <AiTwotoneHeart style={{ color: "red" }} size={24} />
                )}
              </button>
              <p className="count-text">{likes > 0 ? likes : ""}</p>
            </div>
            <div className="counts-container ">
              <button onClick={() => setCommentModal(true)}>
                <BiCommentDetail style={{ color: "gray" }} size={24} />
              </button>
              <p className="count-text">
                {commentsCount > 0 ? commentsCount : ""}
              </p>
            </div>
          </div>
          <div className="flex-between-center">
            <textarea
              id="comment"
              name="comment"
              rows="1"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight"
              placeholder="comment here..."
            ></textarea>
            <button
              type="button"
              className={`post-button ${comment ? "hover-post-button" : ""}`}
              disabled={!comment}
              onClick={postComment}
            >
              {!loading ? "Post" : "Post.."}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Comments;
