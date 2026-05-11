import React from "react";
import dp from "../assets/dp.jpg";
import { GoHomeFill } from "react-icons/go";
import { LuSquarePlay } from "react-icons/lu";
import { FaRegPlusSquare } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function Nav() {
  const navigate = useNavigate();
  const {userData} = useSelector(state=>state.user);
  return (
    <div className="w-[90%] h-15 lg:w-[40%] bg-black flex justify-around items-center fixed bottom-5 z-100 rounded-full shadow-md shadow-[#000000]">
      <div>
        <GoHomeFill className="text-white text-[25px] cursor-pointer" onClick={()=>navigate("/")} />
      </div>
      <div onClick={()=>navigate("/flips")}>
        <LuSquarePlay className="text-white text-[25px] cursor-pointer"/>
      </div>
      <div onClick={()=>navigate("/upload")}>
        <FaRegPlusSquare className="text-white text-[25px] cursor-pointer"/>
      </div>
      <div>
        <IoSearch className="text-white text-[25px] cursor-pointer"/>
      </div>

      <div className="w-8 h-8 border-black border-2 rounded-full cursor-pointer overflow-hidden" onClick={()=>navigate(`/profile/${userData.username}`)}>
        <img className="w-full object-cover aspect-square" src={userData.avatar || dp} alt="" />
      </div>
    </div>
  );
}

export default Nav;
