import {Router} from "express"
import isAuth from "../middlewares/isAuth.js"
import { commentPost, getAllMyPosts, likePost, savedPosts, uploadPost } from "../controllers/post.controller.js";
import {upload} from "../config/multer.js"
const postRouter = Router();

postRouter.post("/upload",isAuth,upload.single("media"),uploadPost);
postRouter.get("/getAllMyPosts",isAuth,getAllMyPosts);
postRouter.post("/like/:postId",isAuth,likePost);
postRouter.get("/saved/:postId",isAuth,savedPosts);
postRouter.post("/comment/:postId",isAuth,commentPost);


export default postRouter;