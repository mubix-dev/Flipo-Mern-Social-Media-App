import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import { useDispatch, useSelector } from "react-redux";
import getCurrentUser from "./hooks/getCurrentUser";
import getSuggestedUsers from "./hooks/getSuggestedUsers";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import { Toaster } from "react-hot-toast";
import Upload from "./pages/Upload";
import getAllPosts from "./hooks/getAllPosts";
import getAllFlips from "./hooks/getALLFlips";
import FlipsPage from "./pages/FlipsPage";
import StoryPage from "./pages/StoryPage";
import getAllStories from "./hooks/getALLStories";
import ChatPage from "./pages/ChatPage";
import MessagesField from "./pages/MessagesField";
import io from "socket.io-client";
import { serverURL } from "./main";
import { setOnlineUsers, setSocket } from "./redux/socketSlice";
import getFollowing from "./hooks/getFollowing";
import getPrevChatUsers from "./hooks/getPrevChatUsers";
import Search from "./pages/Search";
import getAllNotifications from "./hooks/getAllNotifiactions";
import NotificationsPage from "./pages/NotificationsPage";
import { setNotificationsData } from "./redux/userSlice";
import { PacmanLoader } from "react-spinners"
function App() {
  const dispatch = useDispatch();
  const { userData, notificationsData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const [isBackendReady, setIsBackendReady] = useState(false)

  useEffect(() => {
    const wakeUpServerAndCheckAuth = async () => {
      try {
        await axios
          .get(`${serverURL}/api/auth/health-check`, { withCredentials: true })
          .catch(() => {});
      } catch (err) {
        console.log("Server waking up...");
      } finally {
          setIsBackendReady(true);
      }
    };

    wakeUpServerAndCheckAuth();
  }, []);

  useEffect(() => {
    if (userData?._id) {
      const socketIo = io(serverURL, {
        query: { userId: userData._id },
      });
      dispatch(setSocket(socketIo));
      socketIo.on("getOnlineUsers", (user) => {
        dispatch(setOnlineUsers(user));
      });
      return () => socketIo.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData, dispatch]);

  socket?.on("newNotification", (notification) => {
    dispatch(setNotificationsData([...notificationsData, notification]));
  });
  getCurrentUser();
  getSuggestedUsers();
  getAllPosts();
  getAllFlips();
  getAllStories();
  getFollowing();
  getPrevChatUsers();
  getAllNotifications();

  if (!isBackendReady) {
    return (
      <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <PacmanLoader className="mr-15" color="#9333ea" size={30}  />
        <p className="text-zinc-500 text-xs mt-2 tracking-wide">
          Waking up secure servers... please wait
        </p>
      </div>
    );
  }
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
        <Route
          path="/story/:username"
          element={userData ? <StoryPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/chats"
          element={userData ? <ChatPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/messageField"
          element={userData ? <MessagesField /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/search"
          element={userData ? <Search /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/notifications"
          element={
            userData ? <NotificationsPage /> : <Navigate to={"/login"} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
