import React, { useEffect, useState, useRef } from "react";
import dp from "../assets/dp.jpg";
import { useNavigate } from "react-router-dom";
import { FaXmark, FaEye, FaPlay } from "react-icons/fa6";
import { useSelector } from "react-redux";

function Story({ story }) {
  const videoRef = useRef();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [imgProgress, setImgProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (story?.mediaType === "image") {
      setImgProgress(0); 
      interval = setInterval(() => {
        setImgProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            navigate("/");
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [story?._id, navigate]); 

  const togglePlay = () => {
    if (!videoRef.current) return;
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
      const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percentage);
      if (percentage >= 99.5) {
        navigate("/");
      }
    }
  };

  return (
    <div className="w-full max-w-112.5 h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden lg:border-x border-zinc-800">
      
      {!isPlaying && story?.mediaType === "video" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-black/40 p-6 rounded-full">
            <FaPlay className="text-white text-4xl opacity-80" />
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800 z-50">
        <div
          className="h-full bg-violet-600 transition-all duration-250 ease-linear"
          style={{ width: `${story?.mediaType === "video" ? progress : imgProgress}%` }}
        ></div>
      </div>

      <div className="w-full absolute top-0 flex justify-between items-center px-4 py-8 z-40 bg-linear-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <img
            src={story?.author?.avatar || dp}
            className="w-10 h-10 rounded-full border-2 border-violet-500 cursor-pointer object-cover"
            onClick={() => navigate(`/profile/${story?.author?.username}`)}
            alt="avatar"
          />
          <span
            className="font-bold text-sm cursor-pointer text-white drop-shadow-md"
            onClick={() => navigate(`/profile/${story?.author?.username}`)}
          >
            {story?.author?.username}
          </span>
        </div>
        <div
          className="text-white cursor-pointer p-1 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => navigate("/")}
        >
          <FaXmark size={22} />
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-center bg-black">
        {story?.mediaType === "image" ? (
          <img
            className="w-full h-full object-contain"
            src={story?.media}
            alt="content"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            src={story?.media}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            playsInline
          />
        )}
      </div>

      {story?.author?._id === userData?._id && !showViewers && (
        <div
          className="absolute bottom-8 left-0 w-full flex flex-col items-center gap-1 text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer z-40"
          onClick={() => setShowViewers(true)}
        >
          <FaEye size={20} />
          <span className="text-xs font-semibold">
            {story?.viewers?.length || 0} Viewers
          </span>
        </div>
      )}

      {showViewers && (
        <div className="absolute inset-0 bg-black/95 z-60 flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="w-full p-4 flex justify-between items-center border-b border-zinc-800 bg-zinc-900">
            <h3 className="text-white font-bold text-lg">Viewers</h3>
            <FaXmark
              size={24}
              className="text-white cursor-pointer"
              onClick={() => setShowViewers(false)}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {story?.viewers?.length > 0 ? (
              story.viewers.map((viewer) => (
                <div key={viewer._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={viewer.avatar || dp}
                      className="w-12 h-12 rounded-full border border-zinc-700 object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-bold">{viewer.username}</span>
                      <span className="text-zinc-400 text-xs">{viewer.name}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-zinc-500 text-center mt-10 italic">No views yet</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Story;