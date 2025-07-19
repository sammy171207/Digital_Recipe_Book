import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser, signupUser } from "./authThunk";
import { act } from "react";
const userFromStorage = JSON.parse(localStorage.getItem('user'));
const initialState={
    user:userFromStorage || null,
    loading:false,
    error:null,
};

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUser(state, action) {
            state.user = action.payload;
        },
    },
    extraReducers:builder=>{
        builder.addCase(loginUser.pending,state=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload;
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(signupUser.fulfilled,(state,action)=>{
            state.user=action.payload;
        })
        .addCase(logoutUser.fulfilled , state =>{
            state.user=null;
        });
    },
})
export default authSlice.reducer;
export const { setUser } = authSlice.actions;