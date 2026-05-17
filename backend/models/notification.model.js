import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    flip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flip",
    },
    isRead:{
        type:Boolean,
        default:false
    }
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
