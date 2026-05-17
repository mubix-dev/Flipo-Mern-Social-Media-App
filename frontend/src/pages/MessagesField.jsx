import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.jpg";
import { LuImage } from "react-icons/lu";
import { IoSend } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "axios";
import { serverURL } from "../main";
import { setMessages } from "../redux/messageSlice";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

import SenderMsg from "../components/SenderMsg";
import ReceiverMsg from "../components/ReceiverMsg";

function MessagesField() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageRef = useRef();
  const scrollRef = useRef();

  const [input, setInput] = useState("");
  const [frontEndImage, setFrontEndImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { selectedUser, messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);

  const getAllMessages = async () => {
    if (!selectedUser?._id) return;
    try {
      const result = await axios.get(
        `${serverURL}/api/message/getAllMsgs/${selectedUser._id}`,
        { withCredentials: true },
      );
      dispatch(setMessages(result.data || []));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load chats");
    }
  };

  useEffect(() => {
    getAllMessages();
  }, [selectedUser?._id]);

  useEffect(()=>{
    socket?.on("newMessage",(msg)=>{
      dispatch(setMessages([...messages,msg]))
    })
    return ()=>socket?.off("newMessage")
  },[messages,setMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImageInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontEndImage(URL.createObjectURL(file));
    }
  };


  const clearImageField = () => {
    setBackendImage(null);
    setFrontEndImage("");
    if (imageRef.current) imageRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !backendImage) return;
    if (loading) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverURL}/api/message/send/${selectedUser?._id}`,
        formData,
        {
          withCredentials: true,
        },
      );
      dispatch(setMessages([...(messages || []), result.data]));
      setInput("");
      clearImageField();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Message delivery failed");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-zinc-500 text-sm italic">
        No conversation selected.
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white relative">
      <div className="w-full h-20 flex items-center gap-3 px-6 border-b border-zinc-900 shrink-0 bg-black z-10">
        <div
          className="text-[20px] cursor-pointer text-white hover:text-gray-400 transition-colors active:scale-95"
          onClick={() => navigate("/")}
        >
          <FaArrowLeftLong />
        </div>

        <div
          className="w-10 h-10 md:w-12 md:h-12 ml-2.5 border-zinc-700 border rounded-full cursor-pointer overflow-hidden shrink-0"
          onClick={() => navigate(`/profile/${selectedUser?.username}`)}
        >
          <img
            className="w-full h-full object-cover"
            src={selectedUser?.avatar || dp}
            alt="avatar"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="text-[15px] md:text-[18px] font-bold truncate">
            {selectedUser?.name || "User"}
          </div>
          <div className="text-[11px] md:text-[13px] text-gray-500 truncate">
            @{selectedUser?.username}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto p-5 space-y-4 no-scrollbar bg-zinc-950 flex flex-col">
        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            const isMe =
              (msg.sender?._id || msg.sender).toString() ===
              userData?._id?.toString();

            return isMe ? (
              <SenderMsg key={msg._id} msg={msg} />
            ) : (
              <ReceiverMsg key={msg._id} msg={msg} />
            );
          })
        ) : (
          <div className="text-zinc-600 text-center text-xs my-auto italic select-none">
            Say hello to start the conversation!
          </div>
        )}

        <div ref={scrollRef} />

        {messages?.length > 0 && (
          <div className="text-center text-xs text-zinc-600 mt-4 select-none">
            End of conversation history with {selectedUser?.username}
          </div>
        )}
      </div>

      <div className="w-full pb-6 pt-3 flex justify-center items-center bg-black shrink-0 ">
        <form
          onSubmit={handleSendMessage}
          className="w-[92%] relative max-w-200 bg-zinc-900 h-14 rounded-full flex items-center gap-3 px-5 border border-zinc-800 focus-within:border-zinc-700 transition-colors"
        >
          {frontEndImage && (
            <div className="w-24 absolute rounded-xl overflow-hidden border-2 border-violet-600 shadow-xl -top-28 right-4 group animate-in fade-in zoom-in-95 duration-150">
              <img
                className="object-cover aspect-square w-full"
                src={frontEndImage}
                alt="Preview"
              />
              <button
                type="button"
                onClick={clearImageField}
                className="absolute top-1 right-1 text-red-500 hover:text-red-400 bg-black/80 rounded-full cursor-pointer transition-colors"
              >
                <IoMdCloseCircle className="text-xl" />
              </button>
            </div>
          )}

          <input
            className="flex-1 bg-transparent text-white py-2 text-sm md:text-base outline-none disabled:opacity-40"
            type="text"
            placeholder={loading ? "Sending file attachment..." : "Message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />

          <input
            type="file"
            accept="image/*"
            ref={imageRef}
            onChange={handleImageInput}
            hidden
          />

          <button
            type="button"
            className="p-1 cursor-pointer hover:opacity-80 transition-opacity disabled:cursor-not-allowed disabled:opacity-20 shrink-0"
            disabled={frontEndImage || loading}
            onClick={() => imageRef.current.click()}
          >
            <LuImage className="w-6 h-6 text-gray-400" />
          </button>

          <button
            type="submit"
            disabled={(!input.trim() && !frontEndImage) || loading}
            className="p-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-8 shrink-0"
          >
            {!loading ? (
              <IoSend className="w-6 h-6 text-violet-500 hover:text-violet-400 transition-colors" />
            ) : (
              <ClipLoader color="#870ccf" size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessagesField;
