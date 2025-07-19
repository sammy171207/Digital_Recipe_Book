import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../feature/auth/authSlice'
import recipeReducer from '../feature/recipes/recipeSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        recipes: recipeReducer,
    },
})