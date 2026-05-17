import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setNotificationsData } from "../redux/userSlice";

const getAllNotifications = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

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

    fetchAllNotificationsData();
  }, [dispatch, userData]);
};

export default getAllNotifications;