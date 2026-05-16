import {Router} from "express"
import isAuth from "../middlewares/isAuth.js"
import { getAllMessages, getPrevUserChats, sendMessage } from "../controllers/message.controller.js";
import {upload} from "../config/multer.js"
const messageRouter = Router();

messageRouter.post("/send/:receiverId",isAuth,upload.single("image"),sendMessage);
messageRouter.get("/getAllMsgs/:receiverId",isAuth,getAllMessages);
messageRouter.get("/prevChats",isAuth,getPrevUserChats);



export default messageRouter;