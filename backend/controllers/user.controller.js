import User from "../models/user.model.js"
const getCurrentUser = async(req,res)=>{
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");

        if(!userId){
            return res.status(400).json({message:"User not found!"})
        }

        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message:`getCurrentUser error: ${error}`})
    }
}

export default getCurrentUser;