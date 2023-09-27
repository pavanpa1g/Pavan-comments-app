"use client";
import React, { useEffect, useState } from "react";
import "./index.css";
import Cookies from "js-cookie";
import { Loader } from "@/Components/Loader";
import Header from "@/Components/Header";
import { BsPersonCircle } from "react-icons/bs";
import UserPost from "@/Components/UserPost";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addPosts, removeAllPosts } from "@/store/features/postSlice";
import ProtectedRoute from "../../Components/ProtectedRoute";

const ProfileModal = () => {
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(false);

  const userSelector = useSelector((state) => state.user.users.user);

  const { name, picture, email } = userSelector;

  const dispatch = useDispatch();

  const router = useRouter();

  const fetchUserImages = async () => {
    setPostLoading(true);
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userSelector.token}`,
      },
    };
    const url = `http://localhost:3001/api/image/my/posts`;

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        dispatch(removeAllPosts());
        dispatch(addPosts(data));
        setUserPosts(data);
      }
    } catch (error) {
      console.log("error", error);
    }
    setPostLoading(false);
  };

  const checkUserToken = () => {
    const token = Cookies.get("jwt_token");
    if (!token) {
      router.replace("/login");
    }
  };

  useEffect(() => {
    checkUserToken();
    fetchUserImages();
  }, []);
  return (
    <div className="bg-white min-h-screen p-5 flex flex-col items-center  profile-bg-container">
      <div className="w-full sm:w-[80%] profile-inner-container">
        <Header />
        {loading ? (
          <div className="w-full h-1/2 flex justify-center items-center ">
            <Loader />
          </div>
        ) : (
          <div className="p-2 mt-4">
            <h1 className="head-text font-extrabold text-xl mb-2">Profile</h1>
            <div className="flex items-center">
              <div className="flex my-4 mr-4">
                {/* <BsPersonCircle className="text-gray-400" size={150} /> */}
                <img
                  src={picture}
                  alt={"profile"}
                  className="rounded-full w-[150px] h-[150px]"
                />
              </div>
              <div className="">
                <div className="flex">
                  <h1 className="text-black font-bold mr-2">Name :</h1>
                  <p className="text-gray-600">
                    {name.slice(0, 1).toUpperCase()}
                    {name.slice(1)}
                  </p>
                </div>
                <div className="flex">
                  <h1 className="text-black font-bold mr-2">Email :</h1>
                  <p className="text-gray-600">{email}</p>
                </div>
              </div>
            </div>
            <hr className="mb-2 " />
            <div>
              <h1 className="head-text font-semibold text-lg mb-2">My Posts</h1>
              {postLoading ? (
                <div className="loader flex items-center justify-center h-[105px]">
                  <Loader />
                </div>
              ) : (
                <>
                  {userPosts.length === 0 ? (
                    <div className="no-posts-container w-full justify-center items-center  h-80">
                      <img
                        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
                        alt="no posts"
                        className="no-posts-image"
                      />
                      <h1 className="text-gray-500 font-bold">No Posts Yet!</h1>
                    </div>
                  ) : (
                    <ul className="flex w-full flex-wrap justify-between">
                      {userPosts.map((item) => (
                        <UserPost item={item} key={item._id} />
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ()=>(
  <ProtectedRoute>
    <ProfileModal />
  </ProtectedRoute>
);
