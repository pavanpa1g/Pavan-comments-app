"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./page.css";
import Cookies from "js-cookie";
import Header from "@/Components/Header";
import UserPost from "@/Components/UserPost";
import { useSelector, useDispatch } from "react-redux";
import { addToken, addUserData } from "@/store/features/userSlice";
import HomePageLoading from "@/Components/SkeletonLoading.js/HomePageLoading";
import { addPostSinglePost, addPosts } from "@/store/features/postSlice";
import { Flip, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FailureView from "@/Components/FailureView";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

export default function Home() {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState("");
  const [imagesLoading, setImagesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const selector = useSelector((state) => state.user.users.user);
  const postSelector = useSelector((state) => state.post);

  const dispatch = useDispatch();

  const fetchAllPosts = async () => {
    setImagesLoading(true);
    setApiStatus(apiStatusConstants.inProgress);
    const url = `/api/image`;
    const token = Cookies.get("jwt_token");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        dispatch(addPosts(data));
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
        const { message } = data;
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
      }
    } catch (error) {
      console.log("error", error);
      setApiStatus(apiStatusConstants.failure);
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
    }
    setImagesLoading(false);
  };

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    dispatch(addToken(token));

    const userData = localStorage.getItem("userData");
    if (userData === null || !userData) {
      router.replace("/login");
    } else {
      const user = JSON.parse(userData);
      dispatch(addUserData(user));
    }

    fetchAllPosts();
  }, []);

  const handleImageChange = (e) => {
    console.log(e);
    setSelectedImage(e.target.files[0]);
  };

  const uploadUrlTOBackend = async (url) => {
    const { token } = selector;
    console.log("token", token);
    if (!token) {
      Cookies.remove("jwt_token");
      localStorage.removeItem("userData");
      router.replace("/");
    }
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        imageUrl: url,
        description,
      }),
    };

    try {
      const response = await fetch(`/api/image`, options);
      const data = await response.json();
      if (response.ok) {
        dispatch(addPostSinglePost(data));
        toast.success("Successfully uploaded Image", {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
      } else {
        const { message } = await data;
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
    }
    setImagesLoading(false);
    setSelectedImage("");
  };

  const uploadImage = async (e) => {
    e.preventDefault();

    setImagesLoading(true);

    if (!selectedImage) {
      console.log("No image selected");
      return;
    }

    const data = new FormData();
    data.append("file", selectedImage);
    data.append("upload_preset", "yv2amsun");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dlafvsqxz/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { url } = data;
        uploadUrlTOBackend(url);
      } else {
        toast.error("error uploading image", {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
        setImagesLoading(false);
      }
    } catch (error) {
      console.error(error);
      setImagesLoading(false);
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
    }
  };

  const renderSuccessView = () => {
    if (postSelector.length === 0) {
      return (
        <div className="flex flex-col gap-2 h-[50vh] items-center justify-center">
          <h4 className="text-center font-semibold text-black">
            No One have not created any posts yet!
          </h4>
          <button className="bg-blue-500 px-4 py-2 rounded">
            Upload Image
          </button>
        </div>
      );
    }
    return (
      <ul className="flex justify-between flex-wrap  gap-1 my-2">
        {postSelector.map((item) => {
          return <UserPost item={item} key={item._id} fromProfile={true} />;
        })}
      </ul>
    );
  };

  const renderInProgressView = () => {
    return <HomePageLoading />;
  };

  const renderFailureView = () => {
    const handleRetry = () => {
      fetchAllPosts();
    };
    return (
      <div className=" h-[50vh]  flex items-center justify-center">
        <FailureView handleRetry={handleRetry} />
      </div>
    );
  };

  const renderPosts = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.inProgress:
        return renderInProgressView();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen p-5 flex flex-col items-center w-screen">
      <div className="w-full sm:w-[80%] ">
        <Header />
        <form
          onSubmit={uploadImage}
          className="flex justify-between items-start sm:mt-3 flex-wrap"
        >
          <input
            type="file"
            accept="image/*"
            // value={selectedImage}
            onChange={handleImageChange}
            className="mb-2 sm:mb-0 text-gray-600 font-medium border border-gray-500 self-start w-[250px] rounded "
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded upload-btn"
            disabled={!selectedImage}
          >
            Upload Image
          </button>
        </form>
        {renderPosts()}
      </div>
    </div>
  );
}
