import React, { useState, useRef } from "react";
import { VscUnmute, VscMute } from "react-icons/vsc";
import { FaRegPlayCircle } from "react-icons/fa";

function VideoPlayer({ media }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

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

  return (
    <div
      className="w-full h-full relative cursor-pointer  overflow-hidden bg-zinc-950 flex items-center justify-center"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="max-w-full max-h-full object-contain"
        src={media}
        autoPlay
        muted
        loop
        playsInline
      />

      <div
        className="absolute bottom-4 right-4 bg-black/60 p-2.5 rounded-full text-white backdrop-blur-sm transition-transform active:scale-90"
        onClick={toggleMute}
      >
        {isMuted ? <VscMute size={22} /> : <VscUnmute size={22} />}
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity">
          <span className="text-white text-6xl opacity-80">
            <FaRegPlayCircle />
          </span>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
