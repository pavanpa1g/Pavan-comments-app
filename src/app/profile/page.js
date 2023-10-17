"use client";
import React, { useEffect, useState } from "react";
import "./index.css";
import Cookies from "js-cookie";
import { Loader } from "@/Components/Loader";
import Header from "@/Components/Header";
import UserPost from "@/Components/UserPost";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { addMyPosts } from "@/store/features/myPostSlice";
import { toast } from "react-toastify";
import FailureView from "@/Components/FailureView";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const ProfileModal = () => {
  const [currentUserData, setCurrentUserData] = useState({
    name: "",
    email: "",
    picture: "",
  });
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const myPostsSelector = useSelector((state) => state.myPost);

  const { name, picture, email } = currentUserData;

  const dispatch = useDispatch();

  const router = useRouter();

  const fetchUserImages = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt_token")}`,
      },
    };
    const userData = JSON.parse(localStorage.getItem("userData"));
    const url = `/api/image/user/${userData._id}`;

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        dispatch(addMyPosts(data));
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
        toast.error(data.message, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
      console.log("error", error);
    }
  };

  const checkUserToken = () => {
    const token = Cookies.get("jwt_token");
    if (!token) {
      router.replace("/login");
    }
  };

  useEffect(() => {
    const currentUserData = JSON.parse(localStorage.getItem("userData"));
    setCurrentUserData(currentUserData);
    checkUserToken();
    fetchUserImages();
  }, []);

  const renderSuccess = () => {
    return (
      <>
        {myPostsSelector.length === 0 ? (
          <div className="no-posts-container w-full justify-center items-center  h-80">
            <Image
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
              alt="no posts"
              className="no-posts-image"
              height={240}
              width={240}
            />
            <h1 className="text-gray-500 font-bold">No Posts Yet!</h1>
          </div>
        ) : (
          <ul className="flex w-full flex-wrap justify-between">
            {myPostsSelector.map((item) => (
              <UserPost item={item} key={item._id} />
            ))}
          </ul>
        )}
      </>
    );
  };

  const renderInProgress = () => {
    return (
      <div className="loader flex items-center justify-center h-[105px]">
        <Loader />
      </div>
    );
  };

  const renderFailure = () => {
    const handleRetry = () => {
      fetchUserImages();
    };
    return <FailureView handleRetry={handleRetry} />;
  };

  const renderUserPosts = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccess();
      case apiStatusConstants.inProgress:
        return renderInProgress();
      case apiStatusConstants.failure:
        return renderFailure();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen  flex flex-col items-center  profile-bg-container">
      <Header />
      <div className="w-full sm:w-[80%] profile-inner-container">
        <div className="p-2 mt-4">
          <h1 className="head-text font-extrabold text-xl mb-2">Profile</h1>
          <div className="flex items-center">
            <div className="flex my-4 mr-4">
              <Image
                src={picture}
                alt={"profile"}
                className="rounded-full w-[150px] h-[150px] profile-image"
                width={150}
                height={150}
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
                <h1 className="text-black font-bold mr-2">Email:</h1>
                <p className="text-gray-600">{email}</p>
              </div>
            </div>
          </div>
          <hr className="mb-2 " />
          <div>
            <h1 className="head-text font-semibold text-lg mb-2">My Posts</h1>
            {renderUserPosts()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
