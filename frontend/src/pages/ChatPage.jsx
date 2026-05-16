import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OnlineUsers from "../components/OnlineUsers";

function ChatPage() {
  const navigate = useNavigate();
  const { userData, followingList } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  return (
    <div className="w-full min-h-screen flex flex-col gap-5 ">
      <div
        className="text-[20px]  cursor-pointer text-white  flex items-center gap-2.5 lg:gap-5  py-6 px-5"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong className="lg:hidden" />
        <div className="text-[15px] lg:text-[20px]">Chats</div>
      </div>

      <div className="w-full min-h-screen flex flex-col overflow-y-scroll">
  {followingList?.map((user) => (
    <OnlineUsers key={user._id} user={user} />
  ))}
</div>
    </div>
  );
}

export default ChatPage;
