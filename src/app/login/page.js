"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { ToastContainer, toast,Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./login.css";
import TextInput from "@/Components/TextInput/TextInput";
import { handleSignUp } from "@/Components/apiCallsAndLogics/apicalls";
import { addUserData } from "@/store/features/userSlice";
import LoginForm from "@/Components/LoginForm/LoginForm";



const Login = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [signInLoading, setSignInLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useRouter();

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      navigate.push("/", { replace: true });
    }
  });

  const handleNameChange = (event) => {
    setUserData({ ...userData, name: event.target.value });
  };

  const handleEmailChange = (event) => {
    setUserData({ ...userData, email: event.target.value });
  };
  const handlePasswordChange = (event) => {
    setUserData({ ...userData, password: event.target.value });
  };

  const onSignUp = (event) => {
    setErrorMsg("");
    setUserData({
      name: "",
      email: "",
      password: "",
    });
    handleSignUp(event, userData, setErrorMsg, setSignInLoading);
  };

  const signUpForm = () => {
    return (
      <form className="form-bg-container" onSubmit={onSignUp}>
        <TextInput
          label="Name"
          id="name"
          type="text"
          value={userData.name}
          placeholder="Enter Name"
          onChange={handleNameChange}
          required
        />
        <TextInput
          label="Email"
          id="email"
          type="email"
          value={userData.email}
          placeholder="example@gmail.com"
          onChange={handleEmailChange}
          required
        />
        <TextInput
          label="Password"
          id="password"
          type="password"
          value={userData.password}
          placeholder="Enter Password"
          onChange={handlePasswordChange}
          required
        />
        <button className="bg-blue-500 rounded-lg py-2 font-semibold mt-2">
          Sign Up{signInLoading && "..."}
        </button>

        {errorMsg && <p className="error-message">*{errorMsg}</p>}
      </form>
    );
  };



  return (
    <div className="bg-gray-200 h-screen flex justify-center">
      <ToastContainer />
      <div className="inner-container">
        <div className="bg-white h-20px p-1 rounded mb-2">
          <button
            className={` border-gray-400 ${
              isLogin ? " login-sign-up-button-shadow font-semibold " : ""
            } text-black px-6 sm:px-10 rounded  text-xl py-2`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={` border-gray-400 ${
              !isLogin ? "login-sign-up-button-shadow font-semibold" : ""
            } text-black px-6 sm:px-10 rounded  text-xl py-2 `}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? <LoginForm /> : signUpForm()}
      </div>
    </div>
  );
};

export default Login;
