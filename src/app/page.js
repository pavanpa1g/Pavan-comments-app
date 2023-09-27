"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./page.css";
import Comments from "@/Components/Comments";
import { Loader } from "@/Components/Loader";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import getFormattedDate from "@/utils/Datefunction";
import Header from "@/Components/Header";
import UserPost from "@/Components/UserPost";
import { RxCross2 } from "react-icons/rx";
// import { ProfileModal } from "@/app/ProfileModal/page";

import { useSelector, useDispatch } from "react-redux";
import { addToken, addUserData } from "@/store/features/userSlice";
import HomePageLoading from "@/Components/SkeletonLoading.js/HomePageLoading";
import {addPostSinglePost, addPosts, removeAllPosts } from "@/store/features/postSlice";
import { Flip, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const data = [{ id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];

export default function Home() {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState("");
  const [imagesLoading, setImagesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);

  const selector = useSelector((state) => state.user.users.user);
  const tokenSelector = useSelector(state=> state.user.token)
  const postSelector = useSelector((state) => state.post);
  const dispatch = useDispatch();


  const fetchAllPosts =async()=>{
    setImagesLoading(true)
    console.log("clikced")
    const url = 'http://localhost:3001/api/image'
    const token = Cookies.get('jwt_token')
    const options = {
      method:'GET',
      headers:{
        Authorization:`Bearer ${token}`
      }
    }


    try {
      const response = await fetch(url,options)
      if(response.ok){
        const data  = await response.json()
        dispatch(removeAllPosts())
        dispatch(addPosts(data))
                console.log(data)
      }else{
        const { message } = await response.json();
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
      }
    } catch (error) {
      console.log("error", error);
        toast.error(error, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
    }
    setImagesLoading(false)
  }

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    dispatch(addToken(token))

    console.log("token 1",tokenSelector)

    const userData = localStorage.getItem("userData");
    if (userData === null || !userData) {
      router.replace("/login");
    } else {
      const user = JSON.parse(userData);
      dispatch(addUserData(user));
    }

    fetchAllPosts()
  }, []);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const uploadUrlTOBackend = async (url) => {
    const { token } = selector;
    console.log("token", token);
    if(!token){
      Cookies.remove('jwt_token')
      localStorage.removeItem('userData')
      router.replace('/')
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
      const response = await fetch("http://localhost:3001/api/image", options);
      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        dispatch(addPostSinglePost(data));
        toast.success('Successfully uploaded Image', {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
      } else {
        const { message } = await response.json();
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
    }
    setLoading(false);
    setImagesLoading(false);
    setSelectedImage("");
  
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    setLoading(true);
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

  return (
    <div className="bg-white min-h-screen p-5 flex flex-col items-center w-screen">
      <ToastContainer />
      <div className="w-full sm:w-[80%] ">
        <Header />
        <form
          onSubmit={uploadImage}
          className="flex justify-between items-start sm:mt-3 flex-wrap"
        >
          <input
            type="file"
            accept="image/*"
            value={selectedImage}
            onChange={handleImageChange}
            className="mb-2 sm:mb-0 text-gray-600 font-medium border border-gray-500 self-start w-[250px] rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded upload-btn"
            disabled={!selectedImage}
          >
            Upload Image
          </button>
        </form>

        {imagesLoading ? (
          <HomePageLoading />
        ) : (
          <ul className="flex justify-between flex-wrap  gap-1 my-2">
            {postSelector.map((item) =>{ 
              return (
              <UserPost item={item} key={item._id} />
            )})}
          </ul>
        )}
      </div>
    </div>
  );
}
