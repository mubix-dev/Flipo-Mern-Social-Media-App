import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Flip from "../components/Flip";
function FlipsPage() {
    const navigate = useNavigate();
    const {flipData} = useSelector(state=>state.flip)
  return (
    <div className="w-full min-h-screen bg-black flex items-center gap-5 flex-col">
      <div
        className="text-[20px] cursor-pointer text-white fixed left-0 flex items-center gap-2.5 lg:gap-5  py-6 px-5 z-100"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong />
        <div className="text-[15px] lg:text-[20px]">Flips</div>
      </div>
      <div className="w-full h-screen overflow-y-scroll snap-y snap-mandatory flex  items-center flex-col">
        {flipData.map((flip,index)=>(
            <div className="h-screen snap-start">
                <Flip flip={flip}/>
            </div>
        ))}
      </div>
    </div>
  );
}

export default FlipsPage;
