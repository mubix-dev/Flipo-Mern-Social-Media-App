import { Router } from "express";
import { 
  forgotPasswordRequest, 
  login, 
  logout, 
  resetForgotPassword, 
  signup, 
  verifyResetPassOtp 
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout); 

// Password Recovery
authRouter.post("/forgot-password", forgotPasswordRequest);
authRouter.post("/verify-otp", verifyResetPassOtp);
authRouter.post("/reset-password", resetForgotPassword);

export default authRouter;