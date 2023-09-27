'use client';

import {createSlice,nanoid} from "@reduxjs/toolkit"


const initialState = {
    users:{
        id:'',
        user:{
        _id:"",
        name:"",
        email:"",
        picture:""
    }},
    token:''
}


export const userSlice = createSlice({
    name: "user",
    initialState ,
    reducers : {
               addUserData:(state,action) =>{
                console.log("action",action)
                
                const user = {
                    id:nanoid(),
                    user:action.payload
                }
                state.users = user;
               },
               removeUserData:(state,action)=>{
                state = initialState
               },
               addToken:(state,action)=>{
                state.token = action.payload
               },
               removeToken: (state,action)=>{
                state.token= ''
               }
    }
})

export const {addUserData,removeUserData,addToken,removeToken} = userSlice.actions;


export default userSlice.reducer