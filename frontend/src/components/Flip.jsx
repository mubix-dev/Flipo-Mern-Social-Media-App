import React, { useEffect, useRef, useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaTimes,
} from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { VscMute, VscUnmute } from "react-icons/vsc";
import dp from "../assets/dp.jpg";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setFlipData } from "../redux/flipSlice";
import { serverURL } from "../main";
import axios from "axios";
import FollowBtn from "./FollowBtn";
import { useNavigate } from "react-router-dom";
import { MdOutlineModeComment } from "react-icons/md";
function Flip({ flip }) {
  const videoRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation State
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const lastTap = useRef(0);

  const { userData } = useSelector((state) => state.user);
  const { flipData } = useSelector((state) => state.flip);

  // Intersection Observer for Autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Handle browsers that block autoplay without user interaction
            setIsPlaying(false);
          });
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 },
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percentage =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percentage);
    }
  };

  const updateReduxFlip = (updatedFlip) => {
    const updatedFlips = flipData.map((f) =>
      f._id === flip._id ? updatedFlip : f,
    );
    dispatch(setFlipData(updatedFlips));
  };

  const handleLike = async () => {
    try {
      const result = await axios.post(
        `${serverURL}/api/flip/like/${flip._id}`,
        {},
        { withCredentials: true },
      );
      updateReduxFlip(result.data);
    } catch (error) {
      toast.error("Error liking flip");
    }
  };

  // Double Tap Logic
  const handleDoubleTap = () => {
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 1000);
    if (!flip.likes.includes(userData?._id)) {
      handleLike();
    }
  };

  

  const handleFlipComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/flip/comment/${flip._id}`,
        { message: commentText },
        { withCredentials: true },
      );
      updateReduxFlip(result.data);
      setCommentText("");
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full lg:w-100 h-screen snap-center flex justify-center items-center border-l border-r border-zinc-800 bg-black relative overflow-hidden">
      <video
        ref={videoRef}
        loop
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        playsInline
        src={flip?.media}
        className="w-full h-full object-contain cursor-pointer"
        onDoubleClick={handleDoubleTap}
        onClick={togglePlay}
      />

      {/* Double Tap Heart Animation */}
      {showHeartAnim && (
        <div className="absolute flex items-center justify-center pointer-events-none z-40">
          <FaHeart className="text-red-500 text-9xl animate-ping opacity-80" />
        </div>
      )}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 z-10">
          <FaPlay className="text-white text-6xl opacity-20" />
        </div>
      )}

      {/* Mute Toggle */}
      <div
        className="absolute top-5 right-5 z-20 bg-black/40 p-2 rounded-full text-white cursor-pointer"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? <VscMute size={20} /> : <VscUnmute size={20} />}
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 w-full px-4 py-8 bg-linear-to-t from-black/80 to-transparent text-white flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <img
            src={flip?.author?.avatar || dp}
            className="w-10 h-10 rounded-full border border-zinc-500 cursor-pointer"
            onClick={() => navigate(`/profile/${flip?.author.username}`)}
            alt=""
          />
          <span
            className="font-bold text-sm cursor-pointer"
            onClick={() => navigate(`/profile/${flip?.author.username}`)}
          >
            {flip?.author?.username}
          </span>
          {flip?.author?._id !== userData._id && (
            <FollowBtn
              targetedUserId={flip?.author?._id}
              css={
                "border border-white px-3 py-1 rounded-md text-xs font-bold cursor-pointer"
              }
            />
          )}
        </div>
        <p className="text-sm line-clamp-2 max-w-[80%]">{flip?.caption}</p>
      </div>

      {/* Sidebar Actions */}
      <div className="absolute bottom-24 right-4 flex flex-col items-center gap-6 text-white z-10">
        <div
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={handleLike}
        >
          {flip.likes?.includes(userData?._id) ? (
            <FaHeart className="text-red-500 text-3xl transition-transform active:scale-125" />
          ) : (
            <FaRegHeart className="text-3xl transition-transform active:scale-125" />
          )}
          <span className="text-xs font-semibold">{flip?.likes?.length}</span>
        </div>
        <div
          className="flex flex-col items-center  cursor-pointer"
          onClick={() => setShowComments(true)}
        >
          <MdOutlineModeComment className="text-3xl" />
          <span className="text-xs font-semibold">
            {flip?.comments?.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800 z-30">
        <div
          className="h-full bg-violet-600 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* --- COMMENTS BOTTOM SHEET --- */}
      <div
        className={`absolute inset-0 z-50 transition-all duration-300 ${showComments ? "translate-y-0" : "translate-y-full"}`}
      >
        <div
          className="absolute inset-0 bg-black/20"
          onClick={() => setShowComments(false)}
        ></div>
        <div className="absolute bottom-0 w-full h-[70%] bg-zinc-900 rounded-t-3xl flex flex-col border-t border-zinc-700">
          <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-800">
            <span className="text-white font-bold">
              {flip?.comments?.length} Comments
            </span>
            <FaTimes
              className="text-zinc-400 cursor-pointer"
              onClick={() => setShowComments(false)}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
            {flip?.comments?.length > 0 ? (
              flip.comments.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <img
                    src={c.author?.avatar || dp}
                    className="w-8 h-8 rounded-full object-cover"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-xs font-bold">
                        @{c.author?.username}
                      </span>
                      {c.author?._id === flip.author?._id && (
                        <span className="bg-violet-600 text-[10px] px-1.5 py-0.5 rounded text-white font-bold uppercase">
                          Creator
                        </span>
                      )}
                    </div>
                    <p className="text-white text-sm mt-0.5">{c.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                No comments yet.
              </div>
            )}
          </div>
          

          <form
            onSubmit={handleFlipComment}
            className="p-4 border-t border-zinc-800 bg-zinc-900 flex gap-2 items-center"
          >
            <img
              src={userData?.avatar || dp}
              className="w-8 h-8 rounded-full object-cover"
              alt=""
            />
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-zinc-800 text-white text-sm py-2 px-4 rounded-full outline-none border border-transparent focus:border-violet-600"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              disabled={isSubmitting}
              type="submit"
              className="disabled:opacity-30 transition-opacity"
            >
              <IoMdSend className="text-violet-500 text-2xl" />
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default Flip;
