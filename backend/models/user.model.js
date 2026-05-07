import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: [20, "Username cannot exceed 20 characters"],
      minlength: [3, "Name must be at least 3 characters"]
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: [20, "Username cannot exceed 20 characters"],
      minlength: [3, "Username must be at least 3 characters"]
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: [50, "Bio cannot exceed 50 characters"],
    },
    profession: {
      type: String,
    },
    gender: {
      type: String,
      lowercase: true,
      trim: true,
      enum:["male","female","other"]
    },
    followers: [
        { type: mongoose.Schema.Types.ObjectId,
            ref: "User" }
        ],
    following: [
        { type: mongoose.Schema.Types.ObjectId, 
            ref: "User" }
        ],
    posts: [
        { type: mongoose.Schema.Types.ObjectId, 
            ref: "Post" }
        ],
    saved: [
        { type: mongoose.Schema.Types.ObjectId, 
            ref: "Post" }
        ],
    flips: [
        { type: mongoose.Schema.Types.ObjectId, 
            ref: "Flip" }
        ],
    story:{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Story" 
        },
    resetPassOtp:{
        type:String,
        default:""
    },
    resetPassOtpExpiry:{
        type:Date
    },
    resetPassOtpVerified:{
        type:Boolean,
        default:false
    }
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
