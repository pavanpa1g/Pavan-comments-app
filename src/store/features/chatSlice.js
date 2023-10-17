import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChat: {},
  chats: [],
  chatList: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    removeSelectedChat: (state, action) => {
      state.selectedChat = initialState.selectedChat;
    },
    addChats: (state, action) => {
      state.chats.push(...action.payload);
    },
    addSingleChat: (state, action) => {
      state.chats.push(action.payload);
    },
    addChatsList: (state, action) => {
      state.chatList.push(...action.payload);
    },
    addSingleChatList: (state, action) => {
      const isPresent = state.chatList.find(
        (item) => action.payload._id === item._id
      );
      if (isPresent === undefined) {
        state.chatList.push(action.payload);
      }
    },
    removeAllChatList: (state, action) => {
      state.chatList = [];
    },
  },
});

export const {
  addSelectedChat,
  addChats,
  addSingleChat,
  addChatsList,
  addSingleChatList,
  removeSelectedChat,
  removeAllChatList,
} = chatSlice.actions;

export default chatSlice.reducer;
