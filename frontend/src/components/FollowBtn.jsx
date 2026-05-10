import axios from "axios";
import React from "react";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing, setUserData, toggleFollowing } from "../redux/userSlice";
import toast from "react-hot-toast";

function FollowBtn({targetedUserId,css,onFollowChange}) {
    const dispatch = useDispatch()
    const {userData,following} = useSelector(state=>state.user);
    const isFollowing = following.includes(targetedUserId);
    const handleFollow = async()=>{
        try {
          const result = await axios.get(`${serverURL}/api/user/follow/${targetedUserId}`,{withCredentials:true})
            dispatch(toggleFollowing(targetedUserId));
            if(onFollowChange){
                onFollowChange();
            }
            isFollowing ? toast.success("Unfollow Successfully"):toast.success("Follow Successfully")
        } catch (error) {
          console.log(error);
          toast.error(error.response?.data?.message)
        }
      }
  return (
    <div className={css}onClick={handleFollow}>
      {isFollowing?"Following":"Follow"}
    </div>
  );
}

export default FollowBtn;
