"use client";

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import postSlice from "./features/postSlice";
import chatSlice from "./features/chatSlice";

export const store = configureStore({
  reducer: { user: userSlice, post: postSlice,chat:chatSlice },
});
