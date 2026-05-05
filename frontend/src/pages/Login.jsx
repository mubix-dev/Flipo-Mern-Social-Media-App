import React, { useState } from "react";
import logo from "../assets/logo3.png";
import icon from "../assets/icon.png";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import axios from "axios"
import { serverURL } from "../main";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
function Login() {
  const [inputClicked, setInputClicked] = useState({
    username: false,
    password: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [username,setUsername] = useState("");
  const [password, setPassword] = useState("");
  let [error, setError] = useState("");
  const navigate = useNavigate();


  const handleLogin = async () => {
    setLoading(true);
    setError(""); 
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/login`,
        { username, password },
        { withCredentials: true }
      );
      console.log(result);
      setLoading(false)
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      console.log(err);
      setLoading(false)
    }
  };

  const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    handleSignup();
  }
};


  return (
    <div className="w-full min-h-screen bg-linear-to-b from-black to-gray-800 flex flex-col justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-100 lg:h-135 bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1A1F23]">
        <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-2.5 gap-1">
          <div className=" w-[70%] flex gap-1 items-center justify-center text-[20px] font-semibold mt-5 rounded-lg">
            <img
              className=" w-40  rounded-2xl bg-transparent"
              src={logo}
              alt=""
            />
          </div>
          
          <div
            className="relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl mt-5 border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, username: true })}
          >
            <label
              className={`absolute left-2.5 px-2.5 bg-white text-[15px] transition-all duration-200 pointer-events-none ${inputClicked.username || username.length > 0 ? "-top-3.5 text-sm text-black" : "top-3 text-gray-500"}`}
              htmlFor="username"
            >
              Enter your username
            </label>
            <input
              className="w-full h-full rounded-2xl px-5  outline-none border-0 "
              type="text"
              id="username"
              required
              autoComplete="off"
              onChange={(e)=>setUsername(e.target.value)}
              value={username}
              onBlur={() => setInputClicked({ ...inputClicked, username: false })}
            />
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl mt-5 border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, password: true })}
          >
            <label
              className={`absolute left-2.5 px-2.5 bg-white text-[15px] transition-all duration-200 pointer-events-none ${inputClicked.password || password.length > 0 ? "-top-3.5 text-sm text-black" : "top-3 text-gray-500"}`}
              htmlFor="password"
            >
              Enter your password
            </label>

            <input
              className="w-full h-full rounded-2xl px-5  outline-none border-0 "
              type={showPass ? "text" : "password"}
              id="password"
              required
              autoComplete="off"
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              onKeyDown={handleKeyDown}
              onBlur={() => setInputClicked({ ...inputClicked, password: false })}
            />
            {showPass ? (
              <IoIosEyeOff
                className="w-5 h-5 absolute right-2.5 cursor-pointer"
                onClick={() => setShowPass(false)}
              />
            ) : (
              <IoIosEye
                className="w-5 h-5 absolute right-2.5 cursor-pointer"
                onClick={() => setShowPass(true)}
              />
            )}
          </div>
          <p className="w-[90%] mt-2.5 px-2.5 text-sm cursor-pointer text-gray-500" onClick={()=>navigate("/forgot-password")}>Forgot Password?</p>
          {error.length > 0 && <p className="text-red-500   italic">{error}</p>}
          <button className={`w-[70%] px-5 bg-black text-white py-2.5 mt-2.5 rounded-lg font-semibold text-xl ${loading?"cursor-not-allowed bg-gray-700":"cursor-pointer"}`} onClick={handleLogin}  disabled={loading}>{loading?<BeatLoader color="white" size={8}/>:"Login"}</button>
          <p className="text-gray-500 mt-2.5 cursor-pointer" onClick={()=>navigate("/Signup")}>Want to create a new account? <span className="text-black  border-b-2 py-0.5">Signup</span></p>
        </div>

        <div className="md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-2.5 text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black">
          <img className="h-60" src={icon} alt="" />
          <p className="font-light text-xl text-blue-200">Flip The Moment</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
