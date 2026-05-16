import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setAllStoriesData } from "../redux/storySlice";

const getAllStories = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    const fetchAllStoriesData = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/story/getAllStories`, {
          withCredentials: true,
        });
        dispatch(setAllStoriesData(result.data));
      } catch (error) {
        console.log("Error loading global stories feed:", error);
      }
    };

    fetchAllStoriesData();
  }, [dispatch, userData]);
};

export default getAllStories;