import Flip from "../models/flip.model.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

const uploadFlip = async (req, res) => {
  try {
    const { caption } = req.body;

    if (caption && caption.length > 100) {
      return res
        .status(400)
        .json({ message: "Caption is too long (max 100 chars)" });
    }

    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Media is required!" });
    }

    const flip = await Flip.create({
      caption: caption || "",
      media,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    user.flips.push(flip._id);
    await user.save();

    const populatedFlip = await Flip.findById(flip._id).populate(
      "author",
      "name username avatar",
    );

    return res.status(201).json(populatedFlip);
  } catch (error) {
    return res.status(500).json({ message: `uploadFlip error: ${error}` });
  }
};

const likeFlip = async (req, res) => {
  try {
    const flipId = req.params.flipId;

    const flip = await Flip.findById(flipId);
    if (!flip) {
      return res.status(404).json({ message: "Flip not found!" });
    }

    const alreadyLiked = flip.likes.some(
      (id) => id.toString() === req.userId.toString(),
    );
    if (alreadyLiked) {
      flip.likes = flip.likes.filter(
        (id) => id.toString() !== req.userId.toString(),
      );
    } else {
      flip.likes.push(req.userId);
    }

    await flip.save();

    await flip.populate("author", "name username avatar");
    return res.status(200).json(flip);
  } catch (error) {
    return res.status(500).json({ message: `likeFlip error : ${error}` });
  }
};

const commentFlip = async (req, res) => {
  try {
    const flipId = req.params.flipId;
    const { message } = req.body;
    const flip = await Flip.findById(flipId);
    if (!flip) {
      return res.status(404).json({ message: "Flip not found!" });
    }

    flip.comments.push({
      author: req.userId,
      message,
    });

    await flip.save();

    await flip.populate("author", "name username avatar");
    await flip.populate("comments.author");

    return res.status(200).json(flip);
  } catch (error) {
    return res.status(500).json({ message: `commentFlip error: ${error}` });
  }
};

const getAllFlips = async (req, res) => {
  try {
    const flips = await Flip.find({}).populate(
      "author",
      "name username avatar",
    ).populate("comments.author")
    return res.status(200).json(flips);
  } catch (error) {
    return res.status(500).json({ message: `getAllFlips error: ${error}` });
  }
};

export {uploadFlip,likeFlip,commentFlip,getAllFlips};
