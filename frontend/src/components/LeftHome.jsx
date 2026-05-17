import React, { useState } from "react"; 
import logo from "../assets/logo.png";
import dp from "../assets/dp.jpg";
import { FiHeart } from "react-icons/fi";
import { IoArrowBackOutline } from "react-icons/io5"; 
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverURL } from "../main";
import { setUserData } from "../redux/userSlice";
import OtherUser from "./OtherUser";
import { useNavigate } from "react-router-dom"; 
import NotificationsPage from "../pages/NotificationsPage";

function LeftHome() {
  const { userData, suggestedUsers, notificationsData } = useSelector(
    (state) => state.user,
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${serverURL}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="w-[25%] hidden h-screen lg:flex flex-col bg-black border-r-2 border-gray-900 pb-5 shrink-0">
      
      {/* Header Bar */}
      <div className="w-full h-25 flex justify-between items-center p-2.5 shrink-0">
        <img className="w-25" src={logo} alt="Logo" />
        
        <div
          className="relative cursor-pointer"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          {showNotifications ? (
            <IoArrowBackOutline className="text-purple-400 w-5 h-5 transition-colors hover:text-white" />
          ) : (
            <>
              <FiHeart className="text-white w-5 h-5" />
              {notificationsData?.length > 0 &&
                notificationsData?.some((n) => n.isRead === false) && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full absolute -top-0.5 -right-0.5"></div>
                )}
            </>
          )}
        </div>
      </div>

      <div className="w-full flex-1 overflow-y-auto px-1 no-scrollbar">
        {showNotifications ? (
          <div className="w-full h-full animate-fadeIn">
            <p className="text-purple-400 text-[16px] px-4 font-semibold mb-4">
              Notifications
            </p>
            <NotificationsPage />
          </div>
        ) : (
          <div className="w-full animate-fadeIn">
            <div className="w-full flex justify-between items-center px-2.5 border-b-2 border-gray-900 pb-4">
              <div className="flex justify-center items-center gap-2.5">
                <div className="w-13 h-13 border-zinc-800 border rounded-full overflow-hidden">
                  <img
                    className="w-full object-cover aspect-square"
                    src={userData.avatar || dp}
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-white text-[15px] font-semibold">
                    {userData.username}
                  </div>
                  <div className="text-gray-500 text-xs">{userData.name}</div>
                </div>
              </div>
            </div>

              <div className="text-white text-[15px] p-5 font-semibold">
                Suggested for you
              </div>
            <div className="w-full flex flex-col items-center gap-2.5">
              {suggestedUsers &&
                suggestedUsers
                  .slice(0, 3)
                  .map((user) => <OtherUser key={user._id} user={user} />)}
            </div>
          </div>
        )}
      </div>

      <div className="w-full px-5 pt-3 shrink-0 mt-auto">
        <div
          className="text-red-500 text-sm font-medium hover:text-red-400 cursor-pointer inline-block transition-colors"
          onClick={handleLogout}
        >
          Log Out
        </div>
      </div>

    </div>
  );
}

export default LeftHome;