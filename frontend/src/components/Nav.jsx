import React from "react";
import dp from "../assets/dp.jpg";
import { GoHomeFill } from "react-icons/go";
import { LuSquarePlay } from "react-icons/lu";
import { FaRegPlusSquare } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
function Nav() {
  return (
    <div className="w-[90%] h-15 lg:w-[40%] bg-black flex justify-around items-center fixed bottom-5 z-100 rounded-full shadow-md shadow-[#000000]">
      <div>
        <GoHomeFill className="text-white text-[25px] cursor-pointer" />
      </div>
      <div>
        <LuSquarePlay className="text-white text-[25px] cursor-pointer"/>
      </div>
      <div>
        <FaRegPlusSquare className="text-white text-[25px] cursor-pointer"/>
      </div>
      <div>
        <IoSearch className="text-white text-[25px] cursor-pointer"/>
      </div>

      <div className="w-8 h-8 border-black border-2 rounded-full cursor-pointer overflow-hidden">
        <img className="w-full object-cover" src={dp} alt="" />
      </div>
    </div>
  );
}

export default Nav;
