import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios"; // Ensure axios is imported
import VideoPlayer from "../components/VideoPlayer";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setStoryData } from "../redux/storySlice";
import { setFlipData } from "../redux/flipSlice";
import { setUserData } from "../redux/userSlice";

function Upload() {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState("story");
  const [frontendMedia, setFrontendMedia] = useState("");
  const [backendMedia, setBackendMedia] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef();

  const {postData} = useSelector(state=>state.post);
  const {storyData} = useSelector(state=>state.story);
  const {flipData} = useSelector(state=>state.flip);
  const {userData} = useSelector(state=>state.user);

  const dispatch = useDispatch();

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.includes("video");
    const isImage = file.type.includes("image");

    if (uploadType === "flip" && !isVideo) {
      return toast.error("Flips can only be videos!");
    }

    if (isVideo) {
      setMediaType("video");
    } else if (isImage) {
      setMediaType("image");
    } else {
      return toast.error(
        "Invalid Media Type. Please upload an image or video.",
      );
    }
    if (frontendMedia) URL.revokeObjectURL(frontendMedia);
    setBackendMedia(file);
    setFrontendMedia(URL.createObjectURL(file));
  };

  const uploadPost = async () => {
    setLoading(true)
    try {
        const formData = new FormData();
        formData.append("caption",caption);
        formData.append("mediaType",mediaType);
        formData.append("media",backendMedia)
        const result = await axios.post(`${serverURL}/api/post/upload`,formData,{withCredentials:true});
        dispatch(setPostData([...postData,result.data]))
        setLoading(false)
        navigate("/")
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message)
    }
  };
  const uploadStory = async () => {
    setLoading(true)
    try {
        const formData = new FormData();
        formData.append("mediaType",mediaType);
        formData.append("media",backendMedia)
        const result = await axios.post(`${serverURL}/api/story/upload`,formData,{withCredentials:true});
        const updatedUser = { ...userData, story: result.data };
        dispatch(setUserData(updatedUser));
        setLoading(false)
        navigate("/")
        
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message)
        setLoading(false)
    }
  };

  const uploadFlip = async () => {
    setLoading(true)
    try {
        const formData = new FormData();
        formData.append("caption",caption);
        formData.append("video",backendMedia)
        const result = await axios.post(`${serverURL}/api/flip/upload`,formData,{withCredentials:true});
        dispatch(setFlipData(result.data))
        setLoading(false)
        navigate("/")
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message)
        setLoading(false)
    }
  };

  const handleUpload = ()=>{
    if(uploadType === "post"){
        uploadPost();
    }else if(uploadType === "story"){
        uploadStory();
    }else{
        uploadFlip();
    }
  }

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center pb-20">
      <div
        className="w-full text-white flex items-center gap-4 py-6 px-6 cursor-pointer sticky top-0 bg-black z-50"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong className="text-xl" />
        <span className="text-lg font-medium">Upload Media</span>
      </div>

      <div className="w-[90%] max-w-md h-14 bg-zinc-900 rounded-full flex p-1 mt-4">
        {["post", "story", "flip"].map((type) => (
          <div
            key={type}
            className={`${
              uploadType === type ? "bg-white text-black" : "text-zinc-500"
            } flex-1 flex justify-center items-center font-bold rounded-full cursor-pointer transition-all duration-200 capitalize`}
            onClick={() => {
              setUploadType(type);
              setFrontendMedia("");
              setCaption("");
            }}
          >
            {type}
          </div>
        ))}
      </div>

      {!frontendMedia ? (
        <div
          className="w-[90%] max-w-md aspect-square bg-zinc-950 border-2 border-dashed border-zinc-800 flex flex-col gap-3 justify-center items-center mt-10 hover:bg-zinc-900 hover:border-zinc-700 rounded-3xl text-zinc-500 cursor-pointer transition-colors"
          onClick={() => mediaRef.current.click()}
        >
          <input type="file" accept={uploadType == "flip"?"video/*":""} hidden ref={mediaRef} onChange={handleMedia} />
          <FiUpload className="text-4xl" />
          <span className="text-lg font-medium">Select {uploadType} media</span>
        </div>
      ) : (
        <div className="w-[90%] max-w-md mt-8 flex flex-col gap-6 animate-in fade-in duration-500">
          <div
            className={`w-full overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl flex items-center justify-center
            ${uploadType === "flip" ? "aspect-9/16" : "aspect-square"}`}
          >
            {mediaType === "image" ? (
              <img
                className="max-w-full max-h-full object-contain"
                src={frontendMedia}
                alt="Preview"
              />
            ) : (
              <VideoPlayer media={frontendMedia} />
            )}
          </div>

          <div className="w-full space-y-6">
            {uploadType !== "story" && (
              <div className="border-b border-zinc-800 focus-within:border-white transition-colors">
                <textarea
                  className="w-full bg-transparent py-2 outline-none text-white text-lg placeholder:text-zinc-600 resize-none"
                  rows="2"
                  placeholder={`Write a caption for your ${uploadType}...`}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                disabled={loading}
                onClick={handleUpload}
                className="w-full py-4 bg-white text-black font-black rounded-2xl text-lg hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading
                  ? "Sharing..."
                  : `Share ${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}`}
              </button>

              <button
                disabled={loading}
                onClick={() => setFrontendMedia("")}
                className="w-full py-2 text-zinc-500 font-medium hover:text-red-400 transition-colors disabled:opacity-50"
              >
                Cancel and pick another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;
