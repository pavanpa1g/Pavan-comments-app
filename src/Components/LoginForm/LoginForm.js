import React, { useState } from 'react'
import TextInput from '../TextInput/TextInput';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addUserData } from '@/store/features/userSlice';
import Cookies from 'js-cookie';
import { baseUrl } from '@/utils/baseApi';



const LoginForm = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signInLoading, setSignInLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogin = async (event) => {
    event.preventDefault();
    setSignInLoading(true)
    setErrorMsg("");

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    const url = `/api/user/login`;

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        setUserDataLocal(data);

        toast.success("Logged in successfully", {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
      } else {
        const { message } = await response.json();
        setErrorMsg(message);
        toast.error(`${message}`, {
          position: "top-center",
          autoClose: 3000,
          transition: Flip,
        });
      }
    } catch (error) {
      console.log("error", error);
      toast.error(`${error}`, {
        position: "top-center",
        autoClose: 3000,
        transition: Flip,
      });
    }

    setUserData({
      name: "",
      email: "",
      password: "",
    });
    setSignInLoading(false)
  };

  const setUserDataLocal = (data) => {
    const dataJson = JSON.stringify(data);
    localStorage.setItem("userData", dataJson);

    const { token } = data;
    Cookies.set("jwt_token", token, { expires: 30, path: "/" });

    dispatch(addUserData(data));

    router.replace("/");
  };


  const handleEmailChange = (event) => {
    setUserData({ ...userData, email: event.target.value });
  };
  const handlePasswordChange = (event) => {
    setUserData({ ...userData, password: event.target.value });
  };
  return (
    <form
      className="form-bg-container"
      onSubmit={(event) => handleLogin(event)}
    >
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
        Login{signInLoading && "..."}
      </button>
      {errorMsg && <p className="error-message">*{errorMsg}</p>}

    </form>
  );
};


export default LoginForm