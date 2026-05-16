import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setStoryData } from "../redux/storySlice";
import toast from "react-hot-toast";
import Story from "../components/Story";
import { ClipLoader } from "react-spinners";

function StoryPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { storyData } = useSelector((state) => state.story);
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  const fetchUserStory = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`${serverURL}/api/story/storyByUsername/${username}`, {
        withCredentials: true,
      });

      if (!result.data) {
        toast.error("Story has expired or doesn't exist");
        navigate("/");
        return;
      }

      dispatch(setStoryData(result.data));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load story");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchUserStory();
    }
    
    return () => dispatch(setStoryData(null));
  }, [username]);

  useEffect(() => {
    const markAsViewed = async () => {
      if (storyData && storyData.author?._id !== userData?._id) {
        try {
          await axios.get(`${serverURL}/api/story/view/${storyData._id}`, {
            withCredentials: true,
          });
        } catch (e) {
          console.log("View update failed", e);
        }
      }
    };

    if (storyData) markAsViewed();
  }, [storyData?._id]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <ClipLoader color="#870ccf" size={50} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black flex justify-center items-center relative">
      {storyData && <Story story={storyData} />}
    </div>
  );
}

export default StoryPage;