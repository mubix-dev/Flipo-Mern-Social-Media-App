import React, { useState } from "react";
import dp from "../assets/dp.jpg";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import {
  FaRegHeart,
  FaRegCommentAlt,
  FaRegBookmark,
  FaHeart,
  FaBookmark,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverURL } from "../main";
import { setPostData } from "../redux/postSlice";
import toast from "react-hot-toast";
import { setUserData } from "../redux/userSlice";
import FollowBtn from "./FollowBtn";

function Post({ post }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);

  const [showComments, setShowComments] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateReduxPost = (updatedPost) => {
    const updatedPosts = postData.map((p) =>
      p._id === post._id ? updatedPost : p,
    );
    dispatch(setPostData(updatedPosts));
  };

  const handleLike = async () => {
    try {
      const result = await axios.post(
        `${serverURL}/api/post/like/${post._id}`,
        {},
        { withCredentials: true },
      );
      updateReduxPost(result.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error liking post");
    }
  };

  const handleComment = async () => {
    if (!message.trim()) return toast.error("Comment cannot be empty");

    setIsSubmitting(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true },
      );
      updateReduxPost(result.data);
      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error posting comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaved = async () => {
    try {
      const result = await axios.get(
        `${serverURL}/api/post/saved/${post._id}`,
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      // Added a success toast for better UX
      const isSaved = result.data?.saved?.some(
        (item) => (item._id || item) === post._id,
      );
      toast.success(isSaved ? "Post saved!" : "Removed from saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving post");
    }
  };

  return (
    <div className="w-full lg:max-w-[95%] flex flex-col bg-black shadow-lg overflow-hidden rounded-t-4xl text-white mb-4">
      {/* Header */}
      <div className="w-full h-14 md:h-16 flex justify-between items-center py-10 px-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 md:w-12 md:h-12 border-zinc-700 border rounded-full cursor-pointer overflow-hidden"
            onClick={() => navigate(`/profile/${post.author?.username}`)}
          >
            <img
              className="w-full h-full object-cover"
              src={post.author?.avatar || dp}
              alt="avatar"
            />
          </div>
          <div className="font-semibold text-sm md:text-base">
            {post.author?.username || "Loading..."}
          </div>
        </div>
        {userData._id !== post.author._id && <FollowBtn css={"bg-violet-600 hover:bg-violet-700 rounded-lg px-4 py-1.5 text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer"} targetedUserId={post.author?._id} />} 
      </div>

      {/* Media Section */}
      <div className="w-full bg-zinc-900 flex items-center justify-center">
        {post.mediaType === "image" ? (
          <img
            className="w-full h-auto max-h-[75vh] object-contain"
            src={post.media}
            alt="content"
          />
        ) : (
          <div className="w-full h-auto">
            <VideoPlayer media={post.media} />
          </div>
        )}
      </div>

      {/* Actions Area */}
      <div className="p-4 w-full flex flex-col gap-2">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              {/* Optional chaining added for userData safety */}
              {post.likes.includes(userData?._id) ? (
                <FaHeart
                  className="text-red-500 text-xl cursor-pointer"
                  onClick={handleLike}
                />
              ) : (
                <FaRegHeart
                  className="text-xl cursor-pointer"
                  onClick={handleLike}
                />
              )}
              <span className="text-sm font-medium">{post.likes.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaRegCommentAlt
                className="text-lg cursor-pointer"
                onClick={() => setShowComments(!showComments)}
              />
              <span className="text-sm font-medium">
                {post.comments.length}
              </span>
            </div>
          </div>
          {/* Optional chaining added for userData safety */}
          {!userData?.saved?.some((item) => (item._id || item) === post._id) ? (
            <FaRegBookmark
              className="text-xl cursor-pointer hover:text-zinc-400 transition-colors"
              onClick={handleSaved}
            />
          ) : (
            <FaBookmark
              className="text-xl cursor-pointer text-white"
              onClick={handleSaved}
            />
          )}
        </div>

        <p className="text-sm">
          <span className="font-bold mr-2">{post.author?.username}</span>
          {post.caption}
        </p>
      </div>

      {showComments && (
        <div className="w-full px-4 pb-4 bg-zinc-950 border-t border-zinc-900 animate-in fade-in slide-in-from-top-2">
          <div className="max-h-60 overflow-y-auto mt-2 mb-2 space-y-2 ">
            {post.comments?.map((com) => (
              <div className="flex gap-2 items-start" key={com._id}>
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-zinc-800 mt-1">
                  <img
                    className="w-full h-full object-cover"
                    src={com.author?.avatar || dp}
                    alt="avatar"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-zinc-500 mb-0.5 px-1">
                    {com.author?.username}
                  </span>
                  <div className="bg-zinc-900 px-3 py-1 rounded-2xl rounded-tl-none text-sm text-zinc-200 break-words">
                    {com.message}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 border-t border-zinc-800 pt-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 shrink-0">
              <img
                className="w-full h-full object-cover"
                src={userData?.avatar || dp}
                alt="user"
              />
            </div>
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent py-1 text-sm outline-none border-b border-transparent focus:border-violet-500 transition-colors"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              value={message}
            />
            <button
              disabled={isSubmitting || !message.trim()}
              onClick={handleComment}
              className="disabled:opacity-30 transition-opacity cursor-pointer"
            >
              <IoMdSend className="text-violet-500 text-2xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
