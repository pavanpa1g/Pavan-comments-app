import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [];

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addPosts: (state, action) => {
      state.push(...action.payload);
    },
    addPostSinglePost: (state, action) => {
      state.push(action.payload);
    },
    removeAllPosts: (state, action) => {
      state = initialState
    },
    updateLikeOnPost: (state, action) => {
      const { _id } = action.payload;

      // Find the post in the state array by its _id
      const postIndex = state.findIndex((post) => post._id === _id);

      if (postIndex !== -1) {
        // If the post is found, update its likes property
        state[postIndex] = action.payload;
      }
    },
    updateCommentsCountOnPost: (state, action) => {
      const id = action.payload;
      const postIndex = state.findIndex(({ _id }) => _id === id);
      console.log("postIndex",postIndex)
      if (postIndex !== -1) {
        //If the post is found,update comments count on that post
        state[postIndex].commentsCount++;
      }
    },
  },
});

export const {
  addPosts,
  removeAllPosts,
  addPostSinglePost,
  updateLikeOnPost,
  updateCommentsCountOnPost,
} = postSlice.actions;

export default postSlice.reducer;
