import mongoose, { Schema } from "mongoose";


const flipSchema = new Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    media:{
        type:String,
        required:true
    },
    caption:{
        type:String,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},{timestamps:true})


const Flip = mongoose.model("Flip",flipSchema);

export default Flip;