import {Router} from"express"
import {getCurrentUser, getSuggestedUsers } from "../controllers/user.controller.js"
import isAuth from "../middlewares/isAuth.js"
const userRouter = Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.get("/suggested",isAuth,getSuggestedUsers)

export default userRouter;