import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverURL } from "../main";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserData } from "../redux/userSlice";
import { FaArrowLeftLong } from "react-icons/fa6";
import dp from "../assets/dp.jpg";
import Nav from "../components/Nav";
import FollowBtn from "../components/FollowBtn";
import Post from "../components/Post";

function Profile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { profileData, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);

  const [showPosts, setShowPosts] = useState("all");

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
            {profileData?.profession}
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
              {profileData?.followers.slice(0, 3).map((user, index) => (
                <div
                  key={index}
                  className={`w-5 h-5 lg:w-8 lg:h-8 rounded-full overflow-hidden border-2 border-black ${index > 0 ? `absolute left-${index * 2}` : ""} `}
                >
                  <img
                    className="w-full object-cover aspect-square"
                    src={user.avatar || dp}
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:text-[20px]">followers</div>
        </div>
        <div className="flex flex-col justify-center items-center py-1  text-white text-[15px] lg:text-[22px]">
          <div className="flex gap-1">
            <div>{profileData?.following.length}</div>
            <div className=" flex justify-center items-center relative">
              {profileData?.following.slice(0, 3).map((user, index) => (
                <div
                  key={index}
                  className={`w-5 h-5 lg:w-8 lg:h-8 rounded-full overflow-hidden border-2 border-black ${index > 0 ? `absolute left-${index * 2}` : ""} `}
                >
                  <img
                    className="w-full object-cover aspect-square"
                    src={user.avatar || dp}
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:text-[20px]">following</div>
        </div>
      </div>
      <div className="w-full  flex justify-center items-center py-5 gap-5">
        {profileData?._id == userData._id && (
          <button
            className="bg-violet-500 py-1 px-2.5 rounded-lg cursor-pointer text-white text-[15px] lg:text-[20px] hover:bg-violet-600 duration-100"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
        )}
        {profileData?._id != userData._id && (
          <>
            <FollowBtn
              css={
                "bg-violet-500 py-1 px-5 rounded-lg cursor-pointer text-white text-[15px] lg:text-[20px] hover:bg-violet-600 duration-100"
              }
              targetedUserId={profileData?._id}
              onFollowChange={handleProfile}
            />
            <button className="bg-violet-500 py-1 px-2.5 rounded-lg cursor-pointer text-white text-[15px] lg:text-[20px] hover:bg-violet-600 duration-100">
              Message
            </button>
          </>
        )}
      </div>
      <div className="w-full max-w-2xl bg-white rounded-t-[40px] min-h-[60vh] flex flex-col items-center p-4 gap-4 mt-2">
        {/* Decorative Handle */}
        <div className="w-12 h-1.5 bg-zinc-300 rounded-full mb-2"></div>

        {/* Tab Switcher (Only visible on own profile) */}
        {profileData?._id === userData?._id && (
          <div className="w-[80%] max-w-xs h-12 bg-black rounded-full flex p-1 mb-4 shadow-xl">
            {["all", "saved"].map((type) => (
              <div
                key={type}
                className={`${
                  showPosts === type ? "bg-white text-black" : "text-zinc-500"
                } flex-1 flex justify-center items-center font-bold rounded-full cursor-pointer transition-all duration-300 capitalize text-sm`}
                onClick={() => setShowPosts(type)}
              >
                {type}
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Post Feed */}
        <div className="w-full flex flex-col items-center gap-6 mt-2">
          {showPosts === "all" ? (
            postData.filter(
              (post) =>
                post.author?._id?.toString() === profileData?._id?.toString(),
            ).length > 0 ? (
              postData
                .filter(
                  (post) =>
                    post.author?._id?.toString() ===
                    profileData?._id?.toString(),
                )
                .map((post) => <Post key={post._id} post={post} />)
            ) : (
              <div className="py-20 text-center">
                <p className="text-zinc-400 font-semibold">
                  No posts shared yet.
                </p>
              </div>
            )
          ) : 
          postData.filter((post) =>
              userData?.saved?.some(
                (s) => (s._id || s).toString() === post._id.toString(),
              ),
            ).length > 0 ? (
            postData
              .filter((post) =>
                userData?.saved?.some(
                  (s) => (s._id || s).toString() === post._id.toString(),
                ),
              )
              .map((post) => <Post key={post._id} post={post} />)
          ) : (
            <div className="py-20 text-center">
              <p className="text-zinc-400 font-semibold">No saved posts yet.</p>
            </div>
          )}
        </div>

        <div className="h-24"></div>
      </div>
      <Nav />
    </div>
  );
}

export default Profile;
