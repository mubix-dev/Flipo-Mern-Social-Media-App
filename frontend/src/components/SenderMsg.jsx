import React from "react";

function SenderMsg({ msg }) {
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="w-full flex flex-col items-end gap-1 px-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
      <div className="max-w-[75%] md:max-w-[60%] flex flex-col items-end gap-1.5">
        
        {msg?.image && (
          <div className="w-full max-w-72 rounded-2xl rounded-tr-none overflow-hidden border border-zinc-800 bg-zinc-900 shadow-md">
            <img 
              className="w-full h-auto object-contain max-h-60" 
              src={msg.image} 
              alt="Sent media attachment" 
              loading="lazy"
            />
          </div>
        )}

        {msg?.message && (
          <div className="bg-violet-600 text-white text-sm md:text-base px-4 py-2.5 rounded-2xl rounded-tr-none shadow-md wrap-break-word w-fit text-left leading-relaxed">
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

export default SenderMsg;