import {Router} from"express"
import {editProfile, follow, getAllNotifications, getCurrentUser, getFollowingList, getProfile, getSuggestedUsers, markAsRead, search } from "../controllers/user.controller.js"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../config/multer.js"
const userRouter = Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.get("/suggested",isAuth,getSuggestedUsers)
userRouter.post("/editProfile",isAuth,upload.single("avatar"),editProfile)
userRouter.get("/getProfile/:username",isAuth,getProfile)
userRouter.get("/follow/:targetedUserId",isAuth,follow)
userRouter.get("/getFollowing",isAuth,getFollowingList)
userRouter.get("/search",isAuth,search)
userRouter.get("/notifications",isAuth,getAllNotifications)
userRouter.post("/read",isAuth,markAsRead)
export default userRouter;