
import {Router} from "express"
import isAuth from "../middlewares/isAuth.js"
import { getStoryByUsername, upladStory, viewStory } from "../controllers/story.controller.js";
import {upload} from "../config/multer.js"
const storyRouter = Router();

storyRouter.post("/upload",isAuth,upload.single("media"),upladStory);
storyRouter.post("/view/:storyId",isAuth,viewStory);
storyRouter.get("/story/:username",isAuth,getStoryByUsername);


export default storyRouter;