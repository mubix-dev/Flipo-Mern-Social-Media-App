import React from "react";
import dp from "../assets/dp.jpg";
import { useNavigate } from "react-router-dom";

function Notification({ notification }) {
    const navigate = useNavigate();
  return (
    <div className="w-full min-h-15 bg-zinc-900/40 border border-zinc-900/80 rounded-2xl flex items-center gap-3 px-3 py-2.5 transition-all hover:bg-zinc-900/60">
      <div
        className="w-10 h-10 rounded-full cursor-pointer overflow-hidden border border-zinc-800 shrink-0"
        onClick={() => navigate(`/profile/${notification?.sender?.username}`)}
      >
        <img
          className="w-full h-full object-cover aspect-square"
          src={notification?.sender?.avatar || dp}
          alt=""
        />
      </div>

      <div className="flex flex-col max-w-[60%]">
        <div className="text-slate-200 text-[14px] font-semibold leading-tight">
          {notification?.sender?.username || "User"}
        </div>
        <div className="text-zinc-400 text-[12px] font-medium leading-snug mt-0.5 wrap-break-word">
          {notification?.message}
        </div>
      </div>
      {notification?.post && (
        <div className="w-10 h-10 ml-auto flex items-center justify-center rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0">
          {notification?.post?.mediaType === "image" ? (
            <img
              className="w-full h-full object-cover aspect-square"
              src={notification?.post?.media}
              alt=""
            />
          ) : (
            <video
              className="w-full h-full object-cover aspect-square"
              src={notification?.post?.media}
              muted
            />
          )}
        </div>
      )}

      {notification?.flip && (
        <div className="w-10 h-10 ml-auto flex items-center justify-center rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0">
          <video
            className="w-full h-full object-cover aspect-square"
            src={notification?.flip?.media}
            muted
          />
        </div>
      )}
    </div>
  );
}

export default Notification;
