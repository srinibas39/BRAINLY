import express from "express";
import {z} from "zod";
import bcrypt from "bcrypt"
import { userModel } from "./db";
import { Request, Response } from "express";
import cors from "cors"


const app = express();
const port = 5000;
app.use(express.json())
app.use(cors())



const passwordSchema = z.string()
  .min(3, "Password must be at least 3 characters long")
  .max(10,"Password should be more than 10 characters long")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");


app.post("/api/v1/signup",async(req,res)=>{
    try{
        const userschema = z.object({
            username:z.string(),
            password:passwordSchema
        })

        const parsedData = userschema.safeParse(req.body);


        if(!parsedData.success){
            res.status(411).json({
                message:"Error in inputs"
            })
            return;
        }
        const hashedPassword = await bcrypt.hash(parsedData.data.password,10)
        const response= await userModel.create({
            username:parsedData.data.username,
            password:hashedPassword
        })
        res.status(200).json({
            message:"user successfully signed up"
        })
        
    }
    catch(err){
        res.status(500).json({
            message:"Internal Server error"
        })
    }
})

app.post("/api/v1/signin",(req,res)=>{

})

//creating content
app.post("/api/v1/content",(req,res)=>{


})

//getting content
app.get("/api/v1/content",(req,res)=>{

})

//deleting content
app.delete("/api/v1/delete/:id",(req,res)=>{

})


//creating a sharable link
app.post("/api/v1/brain/share",(req,res)=>{

})
//fetching the shared link
app.get("/api/v1/brain/share/:shareId",(req,res)=>{

})


app.get("/",(req,res)=>{
    res.json({
        message:"your app has been started"
    })
})


app.listen(port,()=>{
    console.log("App is listening")
})


