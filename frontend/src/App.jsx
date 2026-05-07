import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useSelector } from 'react-redux'
import getCurrentUser from './hooks/getCurrentUser'
import getSuggestedUsers from './hooks/getSuggestedUsers'

function App() {
  getCurrentUser();
  getSuggestedUsers();
  const {userData} = useSelector(state=>state.user)
  return (
    <div>
      <Routes>
        <Route path='/' element={userData?<Home/>:<Navigate to={"/login"}/>}/>
        <Route path='/signup' element={!userData?<Signup/>:<Navigate to={"/"}/>}/>
        <Route path='/login' element={!userData?<Login/>:<Navigate to={"/"}/>}/>
        <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
      </Routes>
    </div>
  )
}

export default App
