import React from "react";
import logo from "../assets/logo.png";
import dp from "../assets/dp.jpg";
import { FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverURL } from "../main";
import { setUserData } from "../redux/userSlice";
import OtherUser from "./OtherUser";
import { useNavigate } from "react-router-dom";
function LeftHome() {
  const { userData,suggestedUsers } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async()=>{
    try {
        await axios.get(`${serverURL}/api/auth/logout`,{withCredentials:true})
        dispatch(setUserData(null));
        navigate("/login")
    } catch (error) {
        console.log(error);
    }
  }
  if(!userData){
    return null
  }
  return (
    <div className="w-[25%] hidden min-h-screen lg:block bg-black border-r-2 border-gray-900">
      <div className="w-full h-25 flex justify-between items-center p-2.5">
        <img className="w-25 " src={logo} alt="" />
        <div>
          <FiHeart className="text-white w-5 h-5 " />
        </div>
      </div>
      <div className="w-full flex  justify-between items-center px-2.5 border-b-2 border-gray-900 pb-2.5">
        <div className="flex justify-center items-center gap-2.5">
          <div className="w-15 h-15 border-black border-2 rounded-full  overflow-hidden">
            <img
              className="w-full object-cover aspect-square"
              src={userData.avatar || dp}
              alt=""
            />
          </div>
          <div>
            <div className="text-white text-lg font-semibold">
              {userData.username}
            </div>
            <div className="text-gray-500 text-sm ">{userData.name}</div>
          </div>
        </div>
        
      </div>
      <div className="w-full flex flex-col gap-5 my-5">
        <p className="text-white text-[16px] px-5 font-semibold">Suggested Users</p>
          {suggestedUsers && suggestedUsers.slice(0,3).map((user,index)=>(
            <OtherUser key={user._id} user={user}/>
          ))}
      </div>
      <div className="text-red-500 text-sm  fixed   bottom-5 left-62 cursor-pointer" onClick={handleLogout}>Log Out</div>
    </div>
  );
}

export default LeftHome;
