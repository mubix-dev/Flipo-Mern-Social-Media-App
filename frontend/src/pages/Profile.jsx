import axios from "axios";
import React, { useEffect, useState, useMemo } from "react"; // Added useMemo
import { serverURL } from "../main";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserData } from "../redux/userSlice";
import { FaArrowLeftLong } from "react-icons/fa6";
import dp from "../assets/dp.jpg";
import Nav from "../components/Nav";
import FollowBtn from "../components/FollowBtn";
import Post from "../components/Post";
import { ClipLoader } from "react-spinners";

function Profile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { profileData, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const [loading, setLoading] = useState(true);
  const [showPosts, setShowPosts] = useState("all");

  const handleProfile = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `${serverURL}/api/user/getProfile/${username}`,
        { withCredentials: true }
      );
      dispatch(setProfileData(result.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(setProfileData(null)); 
    handleProfile();
  }, [username]);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverURL}/api/auth/logout`, { withCredentials: true });
      dispatch(setUserData(null));
      dispatch(setProfileData(null));
      navigate("/login"); 
    } catch (error) {
      console.log(error);
    }
  };

  const filteredPosts = useMemo(() => {
    if (showPosts === "all") {
      return postData.filter(post => post.author?._id?.toString() === profileData?._id?.toString());
    } else {
      return postData.filter(post => 
        userData?.saved?.some(s => (s._id || s).toString() === post._id.toString())
      );
    }
  }, [showPosts, postData, profileData?._id, userData?.saved]);

  if (loading || !profileData) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-white">
        <ClipLoader color="#870ccf" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center">
      <div className="w-full h-20 flex justify-between items-center text-white px-5 sticky top-0 bg-black z-50">
        <div className="text-[20px] cursor-pointer" onClick={() => navigate("/")}>
          <FaArrowLeftLong />
        </div>
        <div className="text-[18px] font-bold truncate max-w-[50%]">
          {profileData?.username}
        </div>
        <div className="text-[16px] text-blue-500 cursor-pointer font-semibold" onClick={handleLogout}>
          Log Out
        </div>
      </div>

      <div className="w-full flex gap-4 lg:gap-10 py-5 px-5 justify-center items-center">
        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-zinc-800 shrink-0">
          <img className="w-full h-full object-cover" src={profileData?.avatar || dp} alt="" />
        </div>
        <div className="flex-1 max-w-50">
          <div className="text-white font-bold text-lg lg:text-2xl">{profileData?.name}</div>
          <div className="text-sm lg:text-base text-zinc-400 font-medium">{profileData?.profession}</div>
          <div className="text-xs lg:text-sm text-zinc-500 mt-1 line-clamp-2">{profileData?.bio}</div>
        </div>
      </div>

      <div className="w-full flex gap-8 lg:gap-16 px-5 justify-center items-center mt-2">
        <div className="flex flex-col items-center text-white">
          <span className="font-bold text-lg">{profileData?.posts?.length || 0}</span>
          <span className="text-zinc-500 text-sm">posts</span>
        </div>
        
        <div className="flex flex-col items-center text-white">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{profileData?.followers?.length || 0}</span>
            <div className="flex relative h-6 w-12">
              {profileData?.followers?.slice(0, 3).map((user, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full overflow-hidden border-2 border-black absolute"
                  style={{ left: `${index * 12}px`, zIndex: 3 - index }}
                >
                  <img className="w-full h-full object-cover" src={user.avatar || dp} alt="" />
                </div>
              ))}
            </div>
          </div>
          <span className="text-zinc-500 text-sm">followers</span>
        </div>

        <div className="flex flex-col items-center text-white">
          <div className="flex items-center gap-2">
             <span className="font-bold text-lg">{profileData?.following?.length || 0}</span>
             <div className="flex relative h-6 w-12">
              {profileData?.following?.slice(0, 3).map((user, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full overflow-hidden border-2 border-black absolute"
                  style={{ left: `${index * 12}px`, zIndex: 3 - index }}
                >
                  <img className="w-full h-full object-cover" src={user.avatar || dp} alt="" />
                </div>
              ))}
            </div>
          </div>
          <span className="text-zinc-500 text-sm">following</span>
        </div>
      </div>

      <div className="w-full flex justify-center items-center py-6 gap-4">
        {profileData?._id === userData?._id ? (
          <button
            className="bg-violet-600 px-8 py-2 rounded-xl font-bold text-white transition-transform active:scale-95"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
        ) : (
          <>
            <FollowBtn
              css="bg-violet-600 px-8 py-2 rounded-xl font-bold text-white transition-all active:scale-95"
              targetedUserId={profileData?._id}
              onFollowChange={handleProfile}
            />
            <button className="bg-zinc-800 px-8 py-2 rounded-xl font-bold text-white">
              Message
            </button>
          </>
        )}
      </div>

      <div className="w-full max-w-2xl bg-white rounded-t-[40px] min-h-[60vh] flex flex-col items-center p-4 gap-4 mt-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="w-12 h-1.5 bg-zinc-300 rounded-full mt-1 mb-2"></div>

        {profileData?._id === userData?._id && (
          <div className="w-[80%] max-w-xs h-11 bg-zinc-100 rounded-full flex p-1 mb-4">
            {["all", "saved"].map((type) => (
              <div
                key={type}
                className={`${
                  showPosts === type ? "bg-white text-black shadow-sm" : "text-zinc-500"
                } flex-1 flex justify-center items-center font-bold rounded-full cursor-pointer transition-all duration-200 capitalize text-sm`}
                onClick={() => setShowPosts(type)}
              >
                {type}
              </div>
            ))}
          </div>
        )}

        <div className="w-full flex flex-col items-center gap-6 mt-2">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <Post key={post._id} post={post} />)
          ) : (
            <div className="py-20 text-center">
              <p className="text-zinc-400 font-medium">
                {showPosts === "all" ? "No posts shared yet." : "No saved posts yet."}
              </p>
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