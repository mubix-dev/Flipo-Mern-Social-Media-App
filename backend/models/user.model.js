import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
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
