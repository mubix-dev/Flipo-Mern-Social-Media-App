import { forgotPasswordMailgenContent, sendEmail } from "../config/mail.js";
import generateToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "Incomplete Information" });
    }

    if(username.length > 20){
      return res.status(400).json({ message: "Username should be less than 16 characters" });
    }
    if(name.length > 20){
      return res.status(400).json({ message: "Name should be less than 20 characters" });
    }
    if(username.length < 3){
      return res.status(400).json({ message: "Username is too short" });
    }
    if(name.length < 3){
      return res.status(400).json({ message: "Name is too short" });
    }
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be greater than 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -resetPassOtp -resetPassOtpVerified -resetPassOtpExpiry",
    );

    return res.status(201).json(createdUser);
  } catch (error) {
    return res.status(500).json({ message: `signup error: ${error}` });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Incomplete credentials!" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict",
    });
    const loginedUser = await User.findById(user._id).select(
      "-password -resetPassOtp -resetPassOtpVerified -resetPassOtpExpiry",
    );

    return res.status(200).json(loginedUser);
  } catch (error) {
    return res.status(500).json({ message: `login error: ${error}` });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successfully!" });
  } catch (error) {
    return res.status(500).json({ message: `logout error: ${error}` });
  }
};

const forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please enter your email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.resetPassOtp = otp;
    user.resetPassOtpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail({
      email: user?.email,
      subject: "Forgot Password Request",
      mailgenContent: forgotPasswordMailgenContent(user?.username, otp),
    });
    return res.status(200).json({
      message: "OTP sent to email",
      email: user?.email,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Forgot password request error: ${error.message}` });
  }
};

const verifyResetPassOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (!otp) return res.status(400).json({ message: "Please enter your otp" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isOtpValid = user.resetPassOtp === otp;
    const isNotExpired = user.resetPassOtpExpiry > Date.now();

    if (isNotExpired && isOtpValid) {
      user.resetPassOtpVerified = true;
      user.resetPassOtp = ""; 
      await user.save();
      
      return res.status(200).json({ 
        success: true, 
        message: "OTP verified successfully" 
      });
    } 
    
    return res.status(400).json({ 
      message: !isNotExpired ? "OTP has expired!" : "Invalid OTP!" 
    });

  } catch (error) {
    return res.status(500).json({ message: `Verify OTP error: ${error.message}` });
  }
};

const resetForgotPassword = async (req, res) => {
  try {
    const { email,newPassword,confirmPass } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please enter your email" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    
    if(newPassword !== confirmPass){
        return res.status(400).json({message:"Please confirm your new password"})
    }
    
    if(!user?.resetPassOtpVerified){
        return res.status(400).json({message:"Otp is not verified"})
    }
    const hashedPassword = await bcrypt.hash(newPassword,10);
    user.password = hashedPassword;
    user.resetPassOtpVerified = false;
    await user.save();

    return res.status(200).json({message:"Password reset successfully"})

  } catch (error) {
    return res.status(500).json({message:`resetForgotPassword error: ${error}`})
  }
};

export { signup, login, logout, forgotPasswordRequest, verifyResetPassOtp,resetForgotPassword};
