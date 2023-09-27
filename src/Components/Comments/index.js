import React, { useState, useEffect, use } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { CommentModal } from "../CommentModal";

import "./index.css";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { updateCommentsCountOnPost, updateLikeOnPost } from "@/store/features/postSlice";

import { Flip, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Comments = ({ image,  username, _id, likedBy, likes,commentsCount }) => {
  const [comment, setComment] = useState("");
  const [commentModal, setCommentModal] = useState(false);
  const [loading, setLoading] = useState(false);


  const dispatch = useDispatch();

  const userSelector = useSelector((state) => state.user.users.user);
  const postSelector = useSelector((state) => state.post);




  const postComment = async () => {
    setLoading(true);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON content type
         Authorization : `Bearer ${userSelector.token}`  ,
      },
      body: JSON.stringify({ comment, imageId: _id}), // Pass the URL directly without `${}`
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/comment",
        options
      );
      if (response.ok) {
        const data = await response.json();
        const {fullComment} = data
        const {commentedOn} = fullComment
        dispatch(updateCommentsCountOnPost(commentedOn))
        
        toast.success('Successfully Commented', {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });

        setComment("");
      } else {
        setLoading(false);
        const {data} = await response.json()
        const {message} = data
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

  useEffect(() => {
    const thisPost = postSelector.filter((item) => item._id === _id);
    const isLikedByMe = thisPost[0].likedBy.includes(userSelector._id);

    // setIsLikedByMe(isLikedByMe);
  }, []);



  const handleLike = async () => {
    const url = `http://localhost:3001/api/image/like/${_id}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt_token")}`,
        // Specify JSON content type
      },
    };
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        dispatch(updateLikeOnPost(data));

      } else {
        console.log("likesresponse", response);
      }


    } catch (error) {
      console.log("likeserror", error);
    }

  };

  const likedByMe = likedBy.findIndex(item => item._id === userSelector._id)


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
          <ToastContainer />
          <div className="flex  items-center mb-1">
            <label className="block text-gray-500 font-semibold mb-2 mr-auto">
              Comment:
            </label>
            <div className="relative">
              <button onClick={handleLike}>
                {likedByMe === -1 || likedBy.includes(userSelector._id) ? (
                  <AiOutlineHeart
                    style={{ color: "gray" }}
                    size={20}
                    className="mr-4"
                  />
                ) : (
                  <AiTwotoneHeart
                    style={{ color: "red" }}
                    size={20}
                    className="mr-4"
                  />
                )}
              </button>
              {likes > 0 && (
                <span className="comment-count text-white text-sm absolute bottom-4 left-3 bg-blue-500 rounded-full flex items-center justify-center">
                  {likes}
                </span>
              )}
            </div>
            <div className="relative ">
              <button onClick={() => setCommentModal(true)}>
                <BiCommentDetail
                  style={{ color: "gray" }}
                  size={20}
                  className="mr-4"
                />
              </button>
              {commentsCount > 0 && (
                <span className="comment-likes text-white text-sm absolute bottom-4 left-3 bg-blue-500 rounded-full flex items-center justify-center px-2">
                  {commentsCount}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
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
              className={`post-button ${
                comment
                  ? "text-blue-500 hover:text-blue-500 hover:border-blue-500"
                  : "bg-white text-gray-500"
              }  font-bold py-2 px-4 rounded`}
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
