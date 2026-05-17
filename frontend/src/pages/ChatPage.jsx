import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OnlineUsers from "../components/OnlineUsers";
import PrevChatUsers from "../components/PrevChatUsers";


function ChatPage() {
  const navigate = useNavigate();
  const { userData, followingList } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { prevChatUsers } = useSelector((state) => state.message);
  return (
    <div className="w-full min-h-screen flex flex-col ">
      <div
        className="text-[20px]  cursor-pointer text-white  flex items-center gap-2.5 lg:gap-5  mt-5 px-5 "
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong className="lg:hidden" />
        <div className="text-[18px] lg:text-[22px] font-semibold">{onlineUsers?.length>1?"Active Friends":"Recent Chats"}</div>
      </div>

      <div className="w-full  flex  gap-2.5 overflow-x-scroll py-2.5 border-b-2 border-gray-900 `">
        {followingList?.map((user) => (
          onlineUsers?.includes(user._id) && <OnlineUsers key={user._id} user={user} />
        ))}
      </div>
      <div className="text-[14px] lg:text-[18px] mt-5 text-slate-400 px-5 font-semibold">{onlineUsers?.length>1?"Recent Chats":""}</div>
      <div className="w-full  flex flex-col py-2.5  gap-2.5 overflow-y-scroll">
        {prevChatUsers?.map((user) => (
          <PrevChatUsers key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default ChatPage;
