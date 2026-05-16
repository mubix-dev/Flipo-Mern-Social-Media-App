import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js"; 
import Message from "../models/message.model.js";

const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { message } = req.body;

    let image = null;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: message || "",
      image,
    });

    await conversation.save();

    return res.status(200).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: `sendMessage error: ${error.message}` });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      return res.status(200).json([]); 
    }

    const messages = await Message.find({ conversationId: conversation._id })
      .populate("sender receiver", "name username avatar")
      .sort({ createdAt: 1 }); 

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: `getAllMessages error: ${error.message}` });
  }
};

const getPrevUserChats = async (req, res) => {
  try {
    const currUserId = req.userId;

    const conversations = await Conversation.find({
      participants: currUserId
    })
      .populate("participants", "name username avatar")
      .sort({ updatedAt: -1 });

    const userMap = {};

    conversations.forEach((conv) => {
      conv.participants.forEach((user) => {
        if (user._id.toString() !== currUserId.toString()) {
          userMap[user._id.toString()] = user;
        }
      });
    });

    const previousUsers = Object.values(userMap);
    return res.status(200).json(previousUsers);
  } catch (error) {
    return res.status(500).json({ message: `getPrevUserChats error: ${error.message}` });
  }
};

export { sendMessage, getAllMessages, getPrevUserChats };