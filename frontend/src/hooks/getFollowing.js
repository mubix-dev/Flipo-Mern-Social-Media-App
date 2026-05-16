import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing, setFollowingList, setUserData } from "../redux/userSlice";

const getFollowing = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) return;

    const fetchFollowingData = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/user/getFollowing`, {
          withCredentials: true,
        });
        dispatch(setFollowingList(result.data))
      } catch (error) {
        console.log("No active session cookie found.");
      }
    };

    fetchFollowingData();
  }, [dispatch, userData]);
};

export default getFollowing;