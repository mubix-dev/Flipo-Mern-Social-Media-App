import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { setPrevChatUsers } from "../redux/messageSlice";

const getPrevChatUsers = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) return;

    const fetchPrevChatUsesrData = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/message/prevChats`, {
          withCredentials: true,
        });
        dispatch(setPrevChatUsers(result.data));
      } catch (error) {
        console.log("No active session cookie found.");
      }
    };

    fetchPrevChatUsesrData();
  }, [dispatch, userData]);
};

export default getPrevChatUsers;