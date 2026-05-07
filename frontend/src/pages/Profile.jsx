import axios from "axios";
import React, { useEffect } from "react";
import { serverURL } from "../main";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserData } from "../redux/userSlice";
import { FaArrowLeftLong } from "react-icons/fa6";
import dp from "../assets/dp.jpg";
import Nav from "../components/Nav";

function Profile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { profileData, userData } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const handleProfile = async () => {
    try {
      const result = await axios.get(
        `${serverURL}/api/user/getProfile/${username}`,
        { withCredentials: true },
      );
      dispatch(setProfileData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleProfile();
  }, [username, dispatch]);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverURL}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setProfileData(null));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" w-full min-h-screen bg-black flex flex-col items-center">
      <div className="w-full h-20 flex justify-between items-center text-white px-5">
        <div
          className="text-[20px] cursor-pointer "
          onClick={() => navigate("/")}
        >
          <FaArrowLeftLong />
        </div>
        <div className="text-[20px] font-semibold">
          {profileData?.username}{" "}
        </div>
        <div
          className="lg:text-[20px] text-blue-500 cursor-pointer"
          onClick={handleLogout}
        >
          Log Out
        </div>
      </div>

      <div className="w-full  flex  gap-2.5  lg:gap-10 py-5 px-5 justify-center items-center">
        <div className="w-17 h-17 md:w-30 md:h-30 border-black border-2 rounded-full  overflow-hidden">
          <img
            className="w-full object-cover aspect-square"
            src={profileData?.avatar || dp}
            alt=""
          />
        </div>
        <div className="w-[50%] lg:w-[15%]">
          <div className="text-white font-semibold text-[15px] lg:text-[20px]">
            {profileData?.name}
          </div>
          <div className="text-[13px] lg:text-[15px]  text-gray-500 font-medium">
            {profileData?.profession }
          </div>
          <div className="text-[12px] lg:text-[15px]  text-gray-500 font-medium truncate">
            {profileData?.bio}
          </div>
        </div>
      </div>
      <div className="w-full  flex  gap-5  lg:gap-10  px-5 justify-center items-center ">
        <div className="flex flex-col justify-center items-center py-1  text-white text-[15px] lg:text-[22px]">
          <div className="">{profileData?.posts.length}</div>
          <div className="lg:text-[20px]">posts</div>
        </div>
        <div className="flex flex-col justify-center items-center py-1  text-white text-[15px] lg:text-[22px]">
          <div className="flex gap-1">
            <div>{profileData?.followers.length}</div>
            <div className=" flex justify-center items-center relative">
              <div className="w-5 h-5 lg:w-8 lg:h-8 rounded-full overflow-hidden border-2 border-black">
                <img className="w-full object-cover" src={dp} alt="" />
              </div>
              <div className="w-5 h-5 lg:w-8 lg:h-8 rounded-full absolute border-2 left-2 border-black overflow-hidden">
                <img className="w-full object-cover" src={dp} alt="" />
              </div>
              <div className="w-5 h-5 lg:w-8 lg:h-8 rounded-full absolute border-2 left-4 border-black overflow-hidden">
                <img className="w-full object-cover" src={dp} alt="" />
              </div>
            </div>
          </div>
          <div className="lg:text-[20px]">followers</div>
        </div>
        <div className="flex flex-col justify-center items-center py-1  text-white text-[15px] lg:text-[22px]">
          <div className="flex gap-1">
            <div>{profileData?.following.length}</div>
            <div className=" flex justify-center items-center relative">
              <div className="w-5 h-5 lg:w-8 lg:h-8 rounded-full overflow-hidden border-2 border-black">
                <img className="w-full object-cover" src={dp} alt="" />
              </div>
              <div className="w-5 h-5 lg:w-8 lg:h-8 rounded-full absolute border-2 left-2 border-black overflow-hidden">
                <img className="w-full object-cover" src={dp} alt="" />
              </div>
              <div className="w-5 h-5 lg:w-8 lg:h-8 rounded-full absolute border-2 left-4 border-black overflow-hidden">
                <img className="w-full object-cover" src={dp} alt="" />
              </div>
            </div>
          </div>
          <div className="lg:text-[20px]">following</div>
        </div>
      </div>
      <div className="w-full  flex justify-center items-center py-5 gap-5">
        {profileData?._id == userData._id && (
          <button className="bg-violet-500 py-1 px-2.5 rounded-lg cursor-pointer text-white text-[15px] lg:text-[20px] hover:bg-violet-600 duration-100" onClick={()=>navigate("/edit-profile")}>
            Edit Profile
          </button>
        )}
        {profileData?._id != userData._id && (
          <>
            <button className="bg-violet-500 py-1 px-5 rounded-lg cursor-pointer text-white text-[15px] lg:text-[20px] hover:bg-violet-600 duration-100">
              Follow
            </button>
            <button className="bg-violet-500 py-1 px-2.5 rounded-lg cursor-pointer text-white text-[15px] lg:text-[20px] hover:bg-violet-600 duration-100">
              Message
            </button>
          </>
        )}
      </div>
      <div className="w-full min-h-screen flex justify-center">
        <div className="w-full max-w-180 bg-white rounded-t-4xl">

        </div>
        <Nav/>
      </div>
    </div>
  );
}

export default Profile;
