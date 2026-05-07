import React, { useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { serverURL } from "../main";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.jpg";
import { setProfileData, setUserData } from "../redux/userSlice";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
function EditProfile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const imageInput = useRef();

  const [frontendImage, setFrontendImage] = useState(userData.avatar || dp);
  const [backendImage, setbackendImage] = useState(null);

  const [name, setName] = useState(userData.name || "");
  const [username, setUsername] = useState(userData.username || "");
  const [bio, setBio] = useState(userData.bio || "");
  const [profession, setProfession] = useState(userData.profession || "");
  const [gender, setGender] = useState(userData.gender || "");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setbackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("profession", profession);
      formData.append("gender", gender);

      if (backendImage) {
        formData.append("avatar", backendImage);
      }

      const result = await axios.post(
        `${serverURL}/api/user/editProfile`,
        formData,
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      dispatch(setProfileData(result.data));
      setLoading(false);
      toast.success("Profile updated successfully!")
      navigate(`/profile/${userData.username}`)
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setLoading(false);
      toast.error(msg);
      console.log(msg);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black flex justify-center">
      <div
        className="text-[20px] cursor-pointer text-white fixed left-0  py-6 px-5"
        onClick={() => navigate(`/profile/${userData.username}`)}
      >
        <FaArrowLeftLong />
      </div>
      <div className=" w-full max-w-180 flex flex-col items-center mt-15 lg:mt-10 gap-3 mb-2 text-white">
        <div className="w-25 h-25  border-black border-2 rounded-full cursor-pointer overflow-hidden">
          <input
            type="file"
            ref={imageInput}
            accept="image/*"
            hidden
            onChange={handleImage}
          />
          <img
            className="w-full object-cover aspect-square"
            src={frontendImage}
            alt="avatar"
            onClick={() => imageInput.current.click()}
          />
        </div>
        <div
          className="w-full text-center text-blue-500 cursor-pointer"
          onClick={() => imageInput.current.click()}
        >
          Edit Profile Picture
        </div>
        <input
          className="w-[90%] bg-gray-900 px-3 py-2.5 outline-none border-2 border-gray-800 rounded-xl"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-[90%] bg-gray-900 px-3 py-2.5 outline-none border-2 border-gray-800 rounded-xl"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-[90%] bg-gray-900 px-3 py-2.5 outline-none border-2 border-gray-800 rounded-xl"
          placeholder="Enter your bio"
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></input>
        <input
          className="w-[90%] bg-gray-900 px-3 py-2.5 outline-none border-2 border-gray-800 rounded-xl"
          type="text"
          placeholder="Enter your profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        />
        <select
          className="w-[90%] bg-gray-900 px-3 py-2.5 outline-none border-2 border-gray-800 rounded-xl"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <button
          className={`w-[50%] px-5 bg-violet-500 hover:bg-violet-600 text-white py-2.5  rounded-lg font-semibold text-xl ${loading ? "cursor-not-allowed bg-gray-700" : "cursor-pointer"}`}
          onClick={handleEditProfile}
          disabled={loading}
        >
          {loading ? <BeatLoader color="white" size={8} /> : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
