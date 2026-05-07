import React from 'react'
import logo from "../assets/logo.png";
import { FiHeart } from "react-icons/fi";
import StoryDp from './StoryDp';
import Nav from './Nav';
function Feed() {
  return (
    <div className='w-full lg:w-[50%] min-h-screen lg:h-screen relative overflow-y-auto bg-black '>
      <div className="w-full h-25 lg:hidden flex justify-between items-center p-2.5 ">
        <img className="w-25 " src={logo} alt="" />
        <div>
          <FiHeart className="text-white w-5 h-5 " />
        </div>
      </div>
      <div className='w-full flex items-center px-3 py-5 gap-5 overflow-auto no-scrollbar'>
        <StoryDp name={"jhjhj"}/>
        <StoryDp name={"jhjhj"}/>
        <StoryDp name={"jhjhj"}/>
        <StoryDp name={"jhjhj"}/>
        <StoryDp name={"jhjhj"}/>
        <StoryDp name={"jhjhj"}/>
        <StoryDp name={"jhjhj"}/>
      </div>

      <div className='w-full min-h-screen flex flex-col items-center gap-5 p-5 pt-10 bg-white rounded-t-[50px]  relative overflow-auto '>
        <Nav/>
      </div>
    </div>
  )
}

export default Feed
