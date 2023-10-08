import { createSlice } from "@reduxjs/toolkit";

const initialState = []

export const myPostSlice = createSlice({
    name: "myPosts",
    initialState,
    reducers: {
        addMyPosts: (state, action) => {
            action.payload.forEach((post) => {
                // Check if the post already exists in the state
                if (!state.some((p) => p._id === post._id)) {
                    // If the post doesn't exist, add it to the state
                    state.push(post);
                }
            });
        },
        updateLikeOnMyPost: (state, action) => {
            const { _id } = action.payload;

            // Find the post in the state array by its _id
            const postIndex = state.findIndex((post) => post._id === _id);

            if (postIndex !== -1) {
                // If the post is found, update its likes property
                state[postIndex] = action.payload;
                console.log(state[postIndex])
            }
        },
        updateCommentsCountOnMyPost: (state, action) => {
            const id = action.payload;
            const postIndex = state.findIndex(({ _id }) => _id === id);
            if (postIndex !== -1) {
                //If the post is found,update comments count on that post
                state[postIndex].commentsCount++;
            }
        },


    }
})


export const { addMyPosts, updateCommentsCountOnMyPost, updateLikeOnMyPost } = myPostSlice.actions

export default myPostSlice.reducer