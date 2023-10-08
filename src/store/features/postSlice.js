import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [];

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addPosts: (state, action) => {
      action.payload.forEach((post) => {
        // Check if the post already exists in the state
        if (!state.some((p) => p._id === post._id)) {
          // If the post doesn't exist, add it to the state
          state.push(post);
        }
      });
    },

    addPostSinglePost: (state, action) => {
      state.push(action.payload);
    },
    updateLikeOnPost: (state, action) => {
      const { _id } = action.payload;
      console.log('id', _id)

      // Find the post in the state array by its _id
      const postIndex = state.findIndex((post) => post._id === _id);

      if (postIndex !== -1) {

        // If the post is found, update its likes property
        state[postIndex] = action.payload;
        console.log(state[postIndex])
      }
    },
    updateCommentsCountOnPost: (state, action) => {
      const id = action.payload;
      const postIndex = state.findIndex(({ _id }) => _id === id);
      console.log("postIndex", postIndex)
      if (postIndex !== -1) {
        //If the post is found,update comments count on that post
        state[postIndex].commentsCount++;
      }
    },
  },
});

export const {
  addPosts,
  addPostSinglePost,
  updateLikeOnPost,
  updateCommentsCountOnPost,
} = postSlice.actions;

export default postSlice.reducer;
