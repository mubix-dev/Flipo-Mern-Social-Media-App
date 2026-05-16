import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUsersData } from "../redux/userSlice";

const getSuggestedUsers = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    const fetchSuggestedUserData = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/user/suggested`, {
          withCredentials: true,
        });
        dispatch(setSuggestedUsersData(result.data));
      } catch (error) {
        console.log("Error loading suggested profiles:", error);
      }
    };

    fetchSuggestedUserData();
  }, [dispatch, userData]); 
};

export default getSuggestedUsers;