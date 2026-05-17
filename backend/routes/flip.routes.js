import {Router} from "express"
import isAuth from "../middlewares/isAuth.js"
import { commentFlip, deleteFlip, getAllFlips, likeFlip, uploadFlip } from "../controllers/flip.controller.js";
import {upload} from "../config/multer.js"
const flipRouter = Router();

flipRouter.post("/upload",isAuth,upload.single("video"),uploadFlip);
flipRouter.get("/getAllFlips",isAuth,getAllFlips);
flipRouter.post("/like/:flipId",isAuth,likeFlip);
flipRouter.post("/comment/:flipId",isAuth,commentFlip);


export default flipRouter;