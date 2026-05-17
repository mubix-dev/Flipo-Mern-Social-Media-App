import React from "react";
import logo from "../assets/logo.png";
import { FiHeart } from "react-icons/fi";
import StoryDp from "./StoryDp";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import Post from "./Post";
import { ClipLoader } from "react-spinners";
import { TbMessage2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

function Feed() {
  const { postData } = useSelector((state) => state.post);
  const { userData,notificationsData } = useSelector((state) => state.user);
  const { allStoriesData } = useSelector((state) => state.story);

  if (!userData || !postData || !allStoriesData) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-white">
        <ClipLoader color="#870ccf" />
      </div>
    );
  }

  const navigate = useNavigate()

  return (
    <div className="w-full lg:w-[50%] h-screen relative overflow-y-auto bg-black no-scrollbar flex flex-col">
      
      <div className="w-full h-25 lg:hidden flex justify-between items-center p-2.5 shrink-0">
        <img className="w-25" src={logo} alt="Logo" />
        <div className="flex items-center gap-2.5  ">
          <div className="relative cursor-pointer"onClick={()=>navigate("/notifications")}>
            <FiHeart className="text-white   w-5 h-5  cursor-pointer active:scale-90 transition-transform" />
          {notificationsData?.length > 0 && notificationsData?.some(n=>n.isRead === false) && <div className="w-2 h-2 bg-purple-500 rounded-full absolute -top-0.5 -right-0.5"></div>}
          </div>
          <TbMessage2 className="text-white w-5 h-5 cursor-pointer active:scale-90 transition-transform" onClick={()=>navigate("/chats")} />
        </div>
      </div>

      
      <div className="w-full flex items-center px-3 py-5 gap-5 overflow-x-auto no-scrollbar shrink-0">
        <StoryDp
          username={"Your Story"}
          avatar={userData?.avatar}
          story={userData?.story}
        />
        {allStoriesData?.length > 0 &&
          allStoriesData.map((story) => (
            <StoryDp
              username={story?.author?.username}
              avatar={story?.author?.avatar}
              story={story}
              key={story?._id}
            />
          ))}
      </div>

      
      <div className="w-full flex-1 flex flex-col items-center gap-2 p-2  pt-10 bg-slate-100 rounded-t-[50px] relative">
        <Nav />
        
        {postData?.length > 0 ? (
          postData.map((post) => <Post key={post?._id} post={post} />)
        ) : (
          
          <div className="w-full h-60 flex justify-center items-center text-[15px] lg:text-[20px] font-semibold text-gray-400 italic">
            No Posts Yet
          </div>
        )}
        <div className="h-24"></div>
      </div>
    </div>
  );
}

export default Feed;