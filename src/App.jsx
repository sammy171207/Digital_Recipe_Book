import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Navbar from './components/Navbar'
import ProfilePage from './pages/ProfilePage'
import AddRecipePage from './pages/AddRecipePage';
import MealPlanPage from './pages/MealPlanPage';
import ViewAllRecipesPage from './pages/ViewAllRecipesPage';
import RecipesPage from './pages/RecipesPage'
import RecipeDetailPage from './pages/RecipeDetailPage'


function App() {


  return (  
  <div className='container grid '>
  <Navbar/>
   <Routes>
    <Route path='/home' element={<Home />} />
    <Route path='/dashboard' element={<DashboardPage/>}/>
    <Route path='/login' element={<LoginPage/>}/>
    <Route path='/signup' element={<SignupPage/>}/>
    <Route path='/profile' element={<ProfilePage/>}/>
    <Route path='/add-recipe' element={<AddRecipePage/>}/>
    <Route path='/meal-plan' element={<MealPlanPage/>}/>
    <Route path='/my-recipes' element={<ViewAllRecipesPage/>}/>
    <Route path='/recipes' element={<RecipesPage/>}/>
    <Route path='/recipe/:id' element={<RecipeDetailPage/>}/>
   </Routes>
   </div>
  )
}

export default App
