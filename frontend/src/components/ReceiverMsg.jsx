import React from "react";
import dp from "../assets/dp.jpg"; 
import { useSelector } from "react-redux";

function ReceiverMsg({ msg }) {
  const { selectedUser } = useSelector((state) => state.message);
  const { onlineUsers } = useSelector((state) => state.socket);
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const isOnline = onlineUsers.includes(selectedUser?._id)
  return (
    <div className="w-full flex items-start gap-2.5 px-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
      
      <div className={`w-8 h-8 rounded-full overflow-hidden shrink-0 border-2 ${isOnline?"border-green-500":"border-zinc-800"} mt-1 shadow-sm`}>
        <img
          className="w-full h-full object-cover aspect-square"
          src={selectedUser?.avatar || dp}
          alt={`${selectedUser?.username || "user"}'s avatar`}
        />
      </div>

      <div className="max-w-[72%] md:max-w-[60%] flex flex-col items-start gap-1">
        
        {msg?.image && (
          <div className="w-full max-w-72 rounded-2xl rounded-tl-none overflow-hidden border border-zinc-900 bg-zinc-900 shadow-sm">
            <img 
              className="w-full h-auto object-contain max-h-60 transition-opacity duration-200" 
              src={msg.image} 
              alt="Received media attachment" 
              loading="lazy"
            />
          </div>
        )}

        {msg?.message && (
          <div className="bg-zinc-800 text-zinc-100 text-sm md:text-base px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm wrap-break-word w-fit text-left leading-relaxed">
            {msg.message}
          </div>
        )}

        <span className="text-[10px] text-zinc-500 font-medium px-1 select-none">
          {formatTime(msg?.createdAt || new Date())}
        </span>

      </div>
    </div>
  );
}

export default ReceiverMsg;