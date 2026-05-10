import React from "react";
import dp from "../assets/dp.jpg";
import { useNavigate } from "react-router-dom";
import FollowBtn from "./FollowBtn";
import axios from "axios";
function OtherUser({ user }) {
  const navigate = useNavigate()
  
  return (
    <div className="w-full flex  justify-between items-center px-5 ">
      <div className="flex justify-center items-center gap-2.5">
        <div className="w-12 h-12 border-black border-2 rounded-full cursor-pointer overflow-hidden" onClick={()=>navigate(`/profile/${user.username}`)}>
          <img className="w-full object-cover aspect-square" src={user.avatar || dp} alt="" />
        </div>
        <div>
          <div className="text-white text-[15px] font-semibold">
            {user.username}
          </div>
          <div className="text-gray-500 text-[12px] ">{user.name}</div>
        </div>
      </div>
      <FollowBtn css={"text-white text-[12px] font-medium  cursor-pointer bg-violet-500 hover:bg-violet-600 rounded-md px-2 py-1 "} targetedUserId={user._id}/>
    </div>
  );
}

export default OtherUser;
