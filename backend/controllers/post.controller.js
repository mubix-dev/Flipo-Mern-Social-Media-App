import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { io } from "../socket.js";
const uploadPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;
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

    const post = await Post.create({
      caption: caption || "",
      mediaType,
      media,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    user.posts.push(post._id);
    await user.save();

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name username avatar",
    );

    return res.status(201).json(populatedPost);
  } catch (error) {
    return res.status(500).json({ message: `uploadPost error: ${error}` });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate(
      "author",
      "name username avatar",
    ).populate("comments.author","name username avatar").sort({createdAt:-1});
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: `getAllPosts error: ${error}` });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === req.userId.toString(),
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.userId.toString(),
      );
    } else {
      post.likes.push(req.userId);
    }
    await post.save();
    await post.populate("author", "name username avatar");
    io.emit("likePost",{
      postId:post._id,
      likes:post.likes
    })
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: `likePost error: ${error}` });
  }
};

const commentPost = async (req, res) => {
  try {
    const { message } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      author: req.userId,
      message,
    });

    await post.save();

    const populatedPost = await Post.findById(postId)
      .populate("author", "name username avatar")
      .populate({
        path: "comments.author",
        select: "name username avatar"
      });

      io.emit("commentOnPost",{
      postId:post._id,
      comments:post.comments
    })

    return res.status(200).json(populatedPost);
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ message: `Internal server error` });
  }
};

const savedPosts = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadySaved = user.saved.some(
      (id) => id.toString() === postId.toString(),
    );
    if (alreadySaved) {
      user.saved = user.saved.filter(
        (id) => id.toString() !== postId.toString(),
      );
    } else {
      user.saved.push(postId);
    }

    await user.save();

    await user.populate("saved");

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `savedPosts error: ${error}` });
  }
};


export { uploadPost, getAllPosts, likePost, commentPost,savedPosts };
