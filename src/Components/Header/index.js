import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsPersonCircle, BsThreeDotsVertical } from "react-icons/bs";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { removeUserData } from "@/store/features/userSlice";

import "./header.css";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const onLogout = () => {
    Cookies.remove("jwt_token");
    localStorage.removeItem("userData");
    dispatch(removeUserData());
    router.replace("/login");
  };

  const profileColor = currentPath === "/profile" ? "#3B82F6" : "black";
  const messageColor = currentPath === "/chats" ? "#3B82F6" : "#000";

  return (
    <div className="header-bg">
      <Link
        href="/"
        className="text-black text-xl font-semibold mr-auto "
        style={{ marginRight: "auto" }}
      >
        <h1 className="image-text">Images</h1>
      </Link>
      <Link href="/profile" className="mr-4 hov">
        <BsPersonCircle
          style={{ color: profileColor }}
          size={26}
          className="person"
        />
      </Link>
      <Link href="/chats" className="hov mr-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1.5em"
          viewBox="0 0 512 512"
          className="message"
        >
          <path
            d="M256.55 8C116.52 8 8 110.34 8 248.57c0 72.3 29.71 134.78 78.07 177.94 8.35 7.51 6.63 11.86 8.05 58.23A19.92 19.92 0 0 0 122 502.31c52.91-23.3 53.59-25.14 62.56-22.7C337.85 521.8 504 423.7 504 248.57 504 110.34 396.59 8 256.55 8zm149.24 185.13l-73 115.57a37.37 37.37 0 0 1-53.91 9.93l-58.08-43.47a15 15 0 0 0-18 0l-78.37 59.44c-10.46 7.93-24.16-4.6-17.11-15.67l73-115.57a37.36 37.36 0 0 1 53.91-9.93l58.06 43.46a15 15 0 0 0 18 0l78.41-59.38c10.44-7.98 24.14 4.54 17.09 15.62z"
            fill={messageColor}
          />
        </svg>
      </Link>

      <button className="logout-button color-logout-button" onClick={onLogout}>
        Logout
      </button>

      <button className="logout-icon" onClick={onLogout}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1.5em"
          viewBox="0 0 512 512"
        >
          <path
            d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
            fill="#3B82F6"
          />
        </svg>
      </button>
    </div>
  );
};

export default Header;
