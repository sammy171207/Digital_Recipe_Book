import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";

export const loginUser=createAsyncThunk("auth/login",async({email,password},thunkAPI)=>{
    try {
        const res=await signInWithEmailAndPassword(auth,email,password)
        localStorage.setItem('user', JSON.stringify(res.user));
        return res.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});


export const signupUser=createAsyncThunk("auth/register",async({email,password},thunkAPI)=>{
    try {
        const res=await createUserWithEmailAndPassword(auth,email,password);
        localStorage.setItem('user', JSON.stringify(res.user));
        return res.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const logoutUser=createAsyncThunk("auth/logout",async()=>{
    await signOut(auth);
    localStorage.removeItem('user');
})