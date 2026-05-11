import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import { useSelector } from "react-redux";
import getCurrentUser from "./hooks/getCurrentUser";
import getSuggestedUsers from "./hooks/getSuggestedUsers";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import { Toaster } from "react-hot-toast";
import Upload from "./pages/Upload";
import getAllPosts from "./hooks/getAllPosts";
import getAllFlips from "./hooks/getALLFlips";
import FlipsPage from "./pages/FlipsPage";
function App() {
  getCurrentUser();
  getSuggestedUsers();
  getAllPosts();
  getAllFlips();
  const { userData } = useSelector((state) => state.user);
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/forgot-password"
          element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
        />
        <Route
          path="/profile/:username"
          element={userData ? <Profile /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/edit-profile"
          element={userData ? <EditProfile /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/upload"
          element={userData ? <Upload /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/flips"
          element={userData ? <FlipsPage /> : <Navigate to={"/login"} />}
        />
        
      </Routes>
    </div>
  );
}

export default App;
