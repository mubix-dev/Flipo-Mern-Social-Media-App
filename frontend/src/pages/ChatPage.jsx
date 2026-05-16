import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen flex flex-col gap-5 ">
      <div
        className="text-[20px]  cursor-pointer text-white  flex items-center gap-2.5 lg:gap-5  py-6 px-5"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong className="lg:hidden" />
        <div className="text-[15px] lg:text-[20px]">Chats</div>
      </div>
    </div>
  );
}

export default ChatPage;
