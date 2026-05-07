import {Router} from"express"
import {editProfile, getCurrentUser, getProfile, getSuggestedUsers } from "../controllers/user.controller.js"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../config/multer.js"
const userRouter = Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.get("/suggested",isAuth,getSuggestedUsers)
userRouter.post("/editProfile",isAuth,upload.single("avatar"),editProfile)
userRouter.get("/getProfile/:username",isAuth,getProfile)
export default userRouter;