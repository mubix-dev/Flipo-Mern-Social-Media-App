import uploadOnCloudinary from "../config/cloudinary.js";
import Story from "../models/story.model.js";
import User from "../models/user.model.js";

const upladStory = async (req, res) => {
  try {
    const { mediaType } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    if (user.story) {
      await Story.findByIdAndDelete(user.story);
      user.story = null;
    }

    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Media is required!" });
    }

    const newStory = await Story.create({
      author: user._id,
      mediaType,
      media,
    });

    user.story = newStory._id;
    await user.save();

    const populatedStory = await newStory.populate([
      { path: "author", select: "name username avatar" },
      { path: "viewers", select: "name username avatar" },
    ]);

    return res.status(201).json(populatedStory);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `upladStory error: ${error.message}` });
  }
};

const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const currentUserId = req.userId.toString();

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(400).json({ message: "Story not found!" });
    }

    const viewersIds = story.viewers.map((id) => id.toString());

    if (!viewersIds.includes(currentUserId)) {
      story.viewers.push(req.userId);
      await story.save();
    }

    await story.populate([
      { path: "author", select: "name username avatar" },
      { path: "viewers", select: "name username avatar" },
    ]);

    return res.status(200).json(story);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `viewStory error: ${error.message}` });
  }
};

const getStoryByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const story = await Story.findOne({ author: user._id })
      .populate("author", "name username avatar")
      .populate("viewers", "name username avatar");

    if (!story && user.story) {
      user.story = null;
      await user.save();
    }

    return res.status(200).json(story); 
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getStoryByUsername error: ${error.message}` });
  }
};

const getAllStories = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingIds = user.following || [];

    const stories = await Story.find({ author: { $in: followingIds } })
      .populate("author", "name username avatar")
      .populate("viewers", "name username avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json(stories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getAllStories error: ${error.message}` });
  }
};

export { upladStory, viewStory, getStoryByUsername, getAllStories };
