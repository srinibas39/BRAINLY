import mongoose, {model,Schema} from "mongoose";


const UserSchema = new Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})

const contentSchema = new Schema({
    link:String,
    type:String,
    title:String,
    tags:[{type:mongoose.Schema.Types.ObjectId,ref:"Tag"}],
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}

})

const tagSchema = new Schema({
    title:String
})

const linkSchema = new Schema({
    hash:String,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,unique:true}
})

export const userModel = model("User",UserSchema);
export const contentModel = model("Content",contentSchema);
export const tagModel = model("Tag",tagSchema);
export const LinkModel = model("link",linkSchema);