import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom"; 
import dp from "../assets/dp.jpg";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setSearchData } from "../redux/userSlice";

function Search() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {searchData} = useSelector(state=>state.user)
  const {userData} = useSelector(state=>state.user)
  const handleSearch = async()=>{
    try {
        const result = await axios.get(`${serverURL}/api/user/search?keyword=${input}`,{withCredentials:true})
        dispatch(setSearchData(result.data))
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(()=>{
    handleSearch();
  },[input])

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center">
      <div
        className="text-[20px] cursor-pointer text-white fixed left-0 flex items-center gap-2.5 lg:gap-5 py-6 px-5 z-50"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong />
      </div>
      <div className="w-full h-25 flex justify-center items-center pt-15">
        <form className="w-[90%] max-w-150 h-14 bg-zinc-950 border border-zinc-800 rounded-full flex items-center gap-2.5 px-5">
            <IoSearchOutline className="text-slate-300" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search users..."
            className="w-full h-full bg-transparent text-white outline-none text-[15px] placeholder-gray-500"
          />
        </form>
      </div>
        { input && <div className="w-[90%] max-w-125 flex flex-col gap-4 mt-6 px-2">
        {searchData && searchData.length > 0 ? (
          searchData.map((user) => (
            user._id != userData?._id &&
            <div 
              key={user?._id} 
              className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/50 cursor-pointer transition-all"
              onClick={() => navigate(`/profile/${user?.username}`)}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={user?.avatar || dp} 
                  alt={user?.username} 
                  className="w-11 h-11 rounded-full object-cover aspect-square border border-zinc-800"
                />
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-white">{user?.username}</span>
                  <span className="text-[12px] text-gray-500">{user?.name}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          input.trim() && (
            <div className="text-gray-500 text-center text-[13px] mt-4">
              No users found matching "{input}"
            </div>
          )
        )}
      </div>}
      {!input && 
      <div className="text-zinc-500  opacity-20  mt-50">
        Flip the moment
        </div>}
      
    </div>
  );
}

export default Search;