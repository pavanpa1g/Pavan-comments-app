"use client";

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import postSlice from "./features/postSlice";
import chatSlice from "./features/chatSlice";
import myPostSlice from "./features/myPostSlice";

export const store = configureStore({
  reducer: { user: userSlice, post: postSlice, chat: chatSlice, myPost: myPostSlice },
});
