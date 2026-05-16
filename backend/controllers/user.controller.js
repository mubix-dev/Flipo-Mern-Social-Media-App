import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId)
      .select(
        "-password -resetPassOtp -resetPassOtpVerified -resetPassOtpExpiry",
      ).populate("posts flips story")

    if (!userId) {
      return res.status(400).json({ message: "User not found!" });
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `getCurrentUser error: ${error}` });
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId },
    }).select(
      "-password -resetPassOtp -resetPassOtpVerified -resetPassOtpExpiry",
    );

    if (!users) {
      return res.status(400).json({ message: "Suggested users not found!" });
    }
    res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getSuggestedUsers error: ${error}` });
  }
};

const editProfile = async (req, res) => {
  try {
    const { name, username, bio, profession, gender } = req.body;
    if (username.length > 20) {
      return res
        .status(400)
        .json({ message: "Username should be less than 16 characters" });
    }
    if (username.length < 3) {
      return res.status(400).json({ message: "Username is too short" });
    }

    if (name.length > 20) {
      return res
        .status(400)
        .json({ message: "Name should be less than 20 characters" });
    }
    if (name.length < 3) {
      return res.status(400).json({ message: "Name is too short" });
    }

    if (bio.length > 50) {
      return res
        .status(400)
        .json({ message: "Bio is too long (max 50 chars)" });
    }

    const user = await User.findById(req.userId).select(
      "-password -resetPassOtp -resetPassOtpVerified -resetPassOtpExpiry",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existedUser = await User.findOne({ username }).select(
      "-password -resetPassOtp -resetPassOtpVerified -resetPassOtpExpiry",
    );
    if (existedUser && existedUser._id.toString() !== req.userId.toString()) {
      return res
        .status(400)
        .json({ message: "This username is already taken" });
    }

    let avatar;
    if (req.file) {
      avatar = await uploadOnCloudinary(req.file.path);
      user.avatar = avatar;
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.bio = bio;
    user.profession = profession;
    user.gender = gender || user.gender;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `editProfile error: ${error}` });
  }
};

const getProfile = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username })
      .select(
        "-password -resetPassOtp -resetPassOtpVerified -resetPassOtpExpiry",
      )
      .populate("posts flips followers following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `getProfile error: ${error}` });
  }
};

const follow = async (req, res) => {
  try {
    const currUserId = req.userId;
    const targetedUserId = req.params.targetedUserId;

    if (!targetedUserId) {
      return res.status(400).json({ message: "Targeted User Id not found" });
    }

    if (currUserId === targetedUserId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const currUser = await User.findById(currUserId);
    if (!currUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const targetedUser = await User.findById(targetedUserId);
    if (!targetedUser) {
      return res.status(400).json({ message: "Targeted user not found" });
    }

    const isFollowing = currUser.following.includes(targetedUserId);
    if (isFollowing) {
      currUser.following = currUser.following.filter(
        (id) => id.toString() != targetedUserId.toString(),
      );
      targetedUser.followers = targetedUser.followers.filter(
        (id) => id.toString() != currUserId.toString(),
      );
      await currUser.save();
      await targetedUser.save();
      return res.status(200).json({
        following: false,
        message: "Unfollow Successfully",
      });
    } else {
      currUser.following.push(targetedUserId);
      targetedUser.followers.push(currUserId);
      await currUser.save();
      await targetedUser.save();
      return res.status(200).json({
        following: true,
        message: "Follow Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: `follow error: ${error}` });
  }
};

export { getCurrentUser, getSuggestedUsers, editProfile, getProfile, follow };
