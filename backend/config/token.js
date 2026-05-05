import jwt from "jsonwebtoken"

const generateToken = (userId)=>{
    try {
        const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})
        return token
    } catch (error) {
        console.log("generateToken error!",error)
        throw new Error("generateToken error!");
        
    }
}

export default generateToken;