import React, { useState, useRef, useEffect } from "react";
import { VscUnmute, VscMute } from "react-icons/vsc";
import { FaPlay } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function VideoPlayer({ media }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          video.play().catch(() => {
            
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

  return (
    <div
      className="w-full h-full relative cursor-pointer overflow-hidden bg-zinc-950 flex items-center justify-center"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        src={media}
        autoPlay
        loop
        muted={isMuted}
        playsInline
      />

      <div
        className="absolute bottom-4 right-4 bg-black/60 p-2.5 rounded-full text-white backdrop-blur-sm transition-transform active:scale-90 z-20"
        onClick={toggleMute}
      >
        {isMuted ? <VscMute size={22} /> : <VscUnmute size={22} />}
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity z-10">
          <span className="text-white text-6xl opacity-20 pointer-events-none">
            <FaPlay />
          </span>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
