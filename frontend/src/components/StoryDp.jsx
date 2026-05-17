import React, { useEffect, useState } from "react";
import dp from "../assets/dp.jpg";
import { AiFillPlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { serverURL } from "../main";
import axios from "axios";

function StoryDp({ username, avatar, story }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { storyData } = useSelector((state) => state.story);
  const { allStoriesData } = useSelector((state) => state.story);
  const [isViewed, setIsViewed] = useState(false);

  useEffect(() => {
    const viewed = story?.viewers?.some(
      (viewerId) =>
        (viewerId._id || viewerId).toString() === userData?._id?.toString(),
    );
    if(viewed){
      setIsViewed(true)
    }else{
      setIsViewed(false)
    }
  }, [story, userData, storyData, allStoriesData]);


  const handleViewers = async () => {
    if (story?._id && !isViewed) {
      try {
        await axios.get(`${serverURL}/api/story/view/${story._id}`, {
          withCredentials: true,
        });
      } catch (error) {
        console.log("Error marking story as viewed:", error);
      }
    }
  };

  const handleClick = () => {
    if (!story && username === "Your Story") {
      navigate("/upload");
    } else if (story && username === "Your Story") {
      handleViewers();
      navigate(`/story/${userData?.username}`);
    } else {
      handleViewers();
      navigate(`/story/${username}`);
    }
  };

  return (
    <div
      className="w-20 shrink-0 flex flex-col justify-center items-center gap-1 relative cursor-pointer group"
      onClick={handleClick}
    >
      <div
        className={`w-18 h-18 flex items-center justify-center rounded-full p-0.5 transition-all duration-300
        ${
          !isViewed
            ? story ? "bg-linear-to-tr from-blue-500 via-pink-500 to-purple-900":""
            : "border-2 border-zinc-800"
        }`}
      >
        <div className="w-full h-full border-2 border-black rounded-full overflow-hidden bg-black">
          <img
            className="w-full h-full object-cover aspect-square transition-transform group-hover:scale-105"
            src={avatar || dp}
            alt={username}
          />
        </div>
      </div>

      {!story && username === "Your Story" && (
        <div className="absolute bottom-6 right-1">
          <AiFillPlusCircle className="text-blue-500 text-[20px] bg-white rounded-full shadow-md" />
        </div>
      )}

      <div className="w-full text-center text-white text-[10px] truncate px-1">
        {username}
      </div>
    </div>
  );
}

export default StoryDp;
