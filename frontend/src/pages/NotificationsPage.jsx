import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import axios from "axios";
import { serverURL } from "../main";
import { useEffect } from "react";
import { setNotificationsData } from "../redux/userSlice";

function NotificationsPage() {
  const navigate = useNavigate();
  const { notificationsData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const ids = notificationsData.map((n) => n._id);
  const fetchAllNotificationsData = async () => {
    try {
      const result = await axios.get(`${serverURL}/api/user/notifications`, {
        withCredentials: true,
      });
      dispatch(setNotificationsData(result.data));
    } catch (error) {
      console.log("Error loading posts feed:", error);
    }
  };
  const markAsRead = async () => {
    try {
      await axios.post(
        `${serverURL}/api/user/read`,
        { notificationId: ids },
        { withCredentials: true },
      );
      await fetchAllNotificationsData()
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    markAsRead();
  }, []);
  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="text-[20px] lg:hidden cursor-pointer text-white fixed left-0 flex items-center gap-2.5 lg:gap-5  py-6 px-5"
        onClick={() => navigate(`/`)}
      >
        <FaArrowLeftLong />
        <div className="text-[15px] lg:text-[20px]">Notifications</div>
      </div>
      <div className="w-full p-2.5 overflow-auto flex flex-col gap-2.5 items-center mt-20 lg:mt-0">
        {notificationsData.map((noti, index) => (
          <Notification notification={noti} />
        ))}
      </div>
    </div>
  );
}

export default NotificationsPage;
