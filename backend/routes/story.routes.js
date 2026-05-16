
import {Router} from "express"
import isAuth from "../middlewares/isAuth.js"
import { getAllStories, getStoryByUsername, upladStory, viewStory } from "../controllers/story.controller.js";
import {upload} from "../config/multer.js"
const storyRouter = Router();

storyRouter.post("/upload",isAuth,upload.single("media"),upladStory);
storyRouter.get("/view/:storyId",isAuth,viewStory);
storyRouter.get("/storyByUsername/:username",isAuth,getStoryByUsername);
storyRouter.get("/getAllStories",isAuth,getAllStories)


export default storyRouter;