import Cookies from "js-cookie";
import {  toast, Flip } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { addUserData } from "@/store/features/userSlice";
import { baseUrl } from "@/utils/baseApi";

// const baseApi = "http://localhost:3001";


export const handleSignUp = async (
  event,
  userData,
  setErrorMsg,
  setSignInLoading
) => {
  event.preventDefault();

  setSignInLoading(true);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  const url = `${baseUrl}/api/user`;

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      toast.success("Signed Up successfully", {
        position: "top-center",
        autoClose: 3000,
      });

    } else {
      const { message } = await response.json();
      setErrorMsg(message);
      toast.error(`${message}`, {
        position: "top-center",
        autoClose: 3000,
      });
      console.log("message", message);
    }
  } catch (error) {
    console.log(error);
  }
  setSignInLoading(false);
};



//  const handleLogin = async (
//   event,
//   userData,
//   setErrorMsg,
//   setSignInLoading
// ) => {
//   event.preventDefault();

//   const options = {
//     method: "POST",
//     headers: {
//       "content-type": "application/json",
//     },
//     body: JSON.stringify(userData),
//   };

//   const url = `${baseApi}/api/user/login`;

//   try {
//     const response = await fetch(url, options);

//     if (response.ok) {
//       const data = await response.json();
//       setUserData(data)
//       toast.success("Logged in successfully", {
//         position: "top-center",
//         autoClose: 3000,
//         transition: Flip,
//       });
//     } else {
//       const { message } = await response.json();
//       setErrorMsg(message);
//       toast.error(`${message}`, {
//         position: "top-center",
//         autoClose: 3000,
//         transition: Flip,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     toast.error(`${error}`, {
//       position: "top-center",
//       autoClose: 3000,
//       transition: Flip,
//     });
//   }
// };




// const setUserData = (data)=>{
//     const dataJson = JSON.stringify(data)
//     localStorage.setItem('userData', dataJson )

//     const {token} = data
//     Cookies.set('jwt_token',token,{ expires: 30, path: "/" })
//     const dispatch = useDispatch()
//     dispatch(addUserData(data))
//     const router = useRouter()
//     router.replace('/')
// }


// import { Provider, useDispatch } from "react-redux";
// import { useEffect } from "react";

// import { addUserData } from "./features/userSlice";
// import Cookies from "js-cookie";


    //   const dispatch = useDispatch()
    // useEffect(
    //     ()=>{
    //         const userDataJSON= localStorage.getItem('userData')
    //         const token  = Cookies.get('jwt_token')
    //         if (!userData || !token){
    //             const userData = JSON.parse(userDataJSON)
    //             const newData = {
    //                 ...userData,token:token
    //             }
    //             dispatch(addUserData(userData))
    //         }else{

    //         }
    //     }
    //     ,[]
    // )