import User from "../models/user.model.js"
const getCurrentUser = async(req,res)=>{
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password -resetPassOtp -resetPassOtpVerified -resetPassOtpExpiry");

        if(!userId){
            return res.status(400).json({message:"User not found!"})
        }

        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message:`getCurrentUser error: ${error}`})
    }
}

const getSuggestedUsers = async(req,res)=>{
    try {
        const users = await User.find({
            _id : {$ne:req.userId}
        }).select("-password -resetPassOtp -resetPassOtpVerified -resetPassOtpExpiry")

        if(!users){
             return res.status(400).json({message:"Suggested users not found!"})
        }
        res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({message:`getSuggestedUsers error: ${error}`})
    }
}

export  {getCurrentUser,getSuggestedUsers};