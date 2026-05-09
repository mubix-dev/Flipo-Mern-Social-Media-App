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

    user.story = newStory;

    await user.save();

    const populatedStory = await Story.findById(newStory._id)
      .populate("author", "name username avatar")
      .populate("viewers", "name username avatar");

    return res.status(201).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: `uplaodStory error: ${error}` });
  }
};

const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(400).json({ message: "Story not found!" });
    }

    const viewersIds = story.viewers.map((id) => id.toString());

    if (!viewersIds.includes(req.userId.toString())) {
      story.viewers.push(req.userId);
      await story.save();
    }

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name username avatar")
      .populate("viewers", "name username avatar");

    return res.status(201).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: `viewStory error: ${error}` });
  }
};

const getStoryByUsername = async(req,res)=>{
    try {
        const username = req.params.username;
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json()
        }

        const story = await Story.findOne({
            author:user._id
        }).populate("viewers author")

        return res.status(200).json(story);
    } catch (error) {
        return res.status(500).json({message:`getStoryByUsername error: ${error}`})
    }
}

export { upladStory,viewStory,getStoryByUsername };
