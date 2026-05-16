import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";

const getAllPosts = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    const fetchAllPostsData = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/post/getAllPosts`, {
          withCredentials: true,
        });
        dispatch(setPostData(result.data));
      } catch (error) {
        console.log("Error loading posts feed:", error);
      }
    };

    fetchAllPostsData();
  }, [dispatch, userData]);
};

export default getAllPosts;