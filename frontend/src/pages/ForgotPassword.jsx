import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import { serverURL } from "../main";
import { useNavigate } from "react-router-dom";
function ForgotPassword() {
  const [inputClicked, setInputClicked] = useState({
    email: false,
    otp: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleForgotPasswordRequest = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${serverURL}/api/auth/forgot-password`,
        { email },
        { withCredentials: true },
      );
      setLoading(false);
      setError("");
      setStep((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message);
      setLoading(false);
      console.log(email);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${serverURL}/api/auth/verify-otp`,
        { otp, email },
        { withCredentials: true },
      );
      setLoading(false);
      setError("");
      setStep((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message);
      setLoading(false);
    }
  };

  const handleResetForgotPassword = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${serverURL}/api/auth/reset-password`,
        { email, newPassword, confirmPass },
        { withCredentials: true },
      );
      setLoading(false);
      setError("");
      navigate("/login")
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message);
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen bg-linear-to-b from-black to-gray-800 flex flex-col justify-center items-center">
      {step === 1 && (
        <div className="w-[90%] lg:max-w-1/3 h-60   bg-white rounded-2xl flex flex-col gap-2.5 justify-center items-center overflow-hidden border-2 border-[#1A1F23]">
          <div>
            <h1 className="text-2xl font-bold">Forgot password</h1>
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl mt-2.5 border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, email: true })}
          >
            <label
              className={`absolute left-2.5 px-2.5 bg-white text-[15px] transition-all duration-200 pointer-events-none ${inputClicked.email || email.length > 0 ? "-top-3.5 text-sm text-black" : "top-3 text-gray-500"}`}
              htmlFor="email"
            >
              Enter your email
            </label>
            <input
              className="w-full h-full rounded-2xl px-5   outline-none border-0 "
              type="email"
              id="email"
              required
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              onBlur={() => setInputClicked({ ...inputClicked, email: false })}
            />
          </div>
          {error.length > 0 && (
            <p className="text-red-500 mt-1.5  italic">{error}</p>
          )}
          <button
            className={`w-[70%] px-5 bg-black text-white py-2.5 mt-2.5 rounded-lg font-semibold text-xl ${loading ? "cursor-not-allowed bg-gray-700" : "cursor-pointer"}`}
            onClick={handleForgotPasswordRequest}
            disabled={loading}
          >
            {loading ? <BeatLoader color="white" size={8} /> : "Send OTP"}
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="w-[90%] lg:max-w-1/3 h-80   bg-white rounded-2xl flex flex-col gap-2.5 justify-center items-center overflow-hidden border-2 border-[#1A1F23]">
          <div className="w-[90%] px-5 flex justify-between items-center ">
            <h1 className="text-l font-semibold text-center text-gray-500 ">
              OTP has send to{" "}
              <span className="text-black font-bold">{email}</span>
            </h1>
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl mt-5 border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, otp: true })}
          >
            <label
              className={`absolute left-2.5 px-2.5 bg-white text-[15px] transition-all duration-200 pointer-events-none ${inputClicked.otp || otp.length > 0 ? "-top-3.5 text-sm text-black" : "top-3 text-gray-500"}`}
              htmlFor="otp"
            >
              Enter your OTP
            </label>
            <input
              className="w-full h-full rounded-2xl px-5 text-center tracking-[0.5em] font-bold text-2xl outline-none border-0 "
              type="text"
              id="otp"
              required
              autoComplete="off"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              maxLength={6}
              onBlur={() => setInputClicked({ ...inputClicked, otp: false })}
            />
          </div>
          {error.length > 0 && (
            <p className="text-red-500 mt-2.5  italic">{error}</p>
          )}
          <button
            className={`w-[70%] px-5 bg-black text-white py-2.5 mt-2.5 rounded-lg font-semibold text-xl ${loading ? "cursor-not-allowed bg-gray-700" : "cursor-pointer"}`}
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? <BeatLoader color="white" size={8} /> : "Submit"}
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="w-[90%] lg:max-w-1/3 h-80   bg-white rounded-2xl flex flex-col gap-2.5 justify-center items-center overflow-hidden border-2 border-[#1A1F23]">
          <div
            className="relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl mt-5 border-2 border-black"
            onClick={() =>
              setInputClicked({ ...inputClicked, newPassword: true })
            }
          >
            <label
              className={`absolute left-2.5 px-2.5 bg-white text-[15px] transition-all duration-200 pointer-events-none ${inputClicked.newPassword || newPassword.length > 0 ? "-top-3.5 text-sm text-black" : "top-3 text-gray-500"}`}
              htmlFor="newPassword"
            >
              Enter your new password
            </label>
            <input
              className="w-full h-full rounded-2xl px-5 font-semibold outline-none border-0 "
              type="text"
              id="newPassword"
              required
              autoComplete="off"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              onBlur={() => setInputClicked({ ...inputClicked, newPassword: false })}
            />
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl mt-5 border-2 border-black"
            onClick={() =>
              setInputClicked({ ...inputClicked, confirmPassword: true })
            }
          >
            <label
              className={`absolute left-2.5 px-2.5 bg-white text-[15px] transition-all duration-200 pointer-events-none ${inputClicked.confirmPassword || confirmPass.length > 0 ? "-top-3.5 text-sm text-black" : "top-3 text-gray-500"}`}
              htmlFor="confirmPassword"
            >
              Confirm your password
            </label>
            <input
              className="w-full h-full rounded-2xl px-5 font-semibold  outline-none border-0 "
              type="text"
              id="confirmPassword"
              required
              autoComplete="off"
              onChange={(e) => setConfirmPass(e.target.value)}
              value={confirmPass}
              onBlur={() => setInputClicked({ ...inputClicked, confirmPassword: false })}
            />
          </div>
          {error.length > 0 && (
            <p className="text-red-500 mt-2.5  italic">{error}</p>
          )}
          <button
            className={`w-[70%] px-5 bg-black text-white py-2.5 mt-2.5 rounded-lg font-semibold text-xl ${loading ? "cursor-not-allowed bg-gray-700" : "cursor-pointer"}`}
            disabled={loading}
            onClick={handleResetForgotPassword}
          >
            {loading ? <BeatLoader color="white" size={8} /> : "Reset"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
