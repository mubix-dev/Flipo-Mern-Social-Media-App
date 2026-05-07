import React from "react";
import dp from "../assets/dp.jpg";
function StoryDp({name}) {
  return (
    <div className="w-20 flex flex-col justify-center items-center gap-0.5">
      <div className="w-18 h-18 flex items-center justify-center bg-linear-to-b from-pink-500 to-blue-500 rounded-full ">
        <div className="w-17 h-17 border-black border-2 rounded-full cursor-pointer overflow-hidden">
          <img
            className="w-full object-cover"
            src={dp}
            alt=""
          />
        </div>
      </div>
      <div className="w-full text-center text-white text-[10px] truncate">
        {name}
      </div>
    </div>
  );
}

export default StoryDp;
