import React from "react";
import dp from "../assets/dp.jpg";
import { useNavigate } from "react-router-dom";
import FollowBtn from "./FollowBtn";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/messageSlice";

function OnlineUsers({ user }) {
  const navigate = useNavigate();
  const { onlineUsers } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  
  const isOnline = onlineUsers?.includes(user?._id?.toString());

  return (
    <div className="w-full flex justify-between items-center px-5 py-2">
      <div className="flex justify-center items-center gap-2.5">
        
        <div className="relative w-12 h-12">
          
          <div
            className="w-full h-full rounded-full cursor-pointer overflow-hidden border border-zinc-800"
            onClick={() => {
              dispatch(setSelectedUser(user));
              navigate("/messageField");
            }}
          >
            <img
              className="w-full h-full object-cover aspect-square"
              src={user?.avatar || dp}
              alt=""
            />
          </div>

          {isOnline && (
            <div className="w-3.5 h-3.5 absolute bg-green-500 rounded-full border-2 bottom-0 right-0 z-50 border-black"></div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="text-white text-[15px] font-semibold">
            {user?.username}
          </div>
          <div className="text-gray-500 text-[12px]">
            {isOnline ? "Active now" : user?.name || "Offline"}
          </div>
        </div>

      </div>
    </div>
  );
}

export default OnlineUsers;