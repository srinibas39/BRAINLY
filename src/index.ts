import express from "express";
import {z} from "zod";
import bcrypt from "bcrypt"
import { contentModel, LinkModel, userModel } from "./db";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken"

import cors from "cors"
import { JwtSecret } from "./config";
import { authVerify } from "./middleware";
import { random } from "./utils";



const app = express();
const port = 5000;
app.use(express.json())
app.use(cors())
dotenv.config()



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

app.post("/api/v1/signin",async(req,res)=>{
    try{
        const userSchema = z.object({
            username:z.string(),
            password:z.string()
        })

        const parsedData = userSchema.safeParse(req.body);
        if(!parsedData.success){
            res.status(411).json({
                message:"Invalid data"
            })
            return;
        }

        const { username, password } = parsedData.data;

        //find user if he is already signed in or not
        const user = await userModel.findOne({username:username});
        if(!user){
            res.json({
                message:"Invalid crredentials"
            })
            return;
        }
        

        //check password
        const passwordMatched = await bcrypt.compare(password,user.password)
        if(!passwordMatched){
           res.json({
            message:"password did not match"
           })
           return
        }

        if(!JwtSecret){
            res.json({
                message:"Interna; server error"
            }).status(500)
            return 
        }
        const token = await jwt.sign({
            ...parsedData.data
        },JwtSecret)

        res.json({
            message:"successfully signed in"
        })


        
    }
    catch(e){
        res.status(500).json({
            message:"Internal server error"
        })
    }
})

//creating content
app.post("/api/v1/content",authVerify,async(req,res)=>{
  try{
      const userId = req.id;
      const {link,type,title} = req.body;
      const response = await contentModel.create({
        link,
        type,
        title,
        tags:[],
        userId:userId
      })

      res.status(200).json({
            message:"content posted"
      })

  }
  catch(e){
    res.status(500).json({
        message:"Internal Server error"
    })
  }


})

//getting content
app.get("/api/v1/content",authVerify , async(req,res)=>{
    try{
        const userId = req.id;
        const content = await contentModel.find({
            userId
        }).populate("userId","username")

        res.json({
            content
        }).status(200)

    }
    catch(e){
        res.json(500).json({
            message:"internal Server error"
        })
    }
})

//deleting content
app.delete("/api/v1/delete/:id",authVerify,async(req,res)=>{
    try{
        const userId = req.id;
        const id = req.params.id;
        const response = contentModel.deleteOne({
            userId:userId,
            _id:id
        })

        res.json({
            message:"content deleted"
        }).status(200);
    }
    catch(e){
        res.status(500).json({
            message:"Internal server error"
        })
    }

})

//search the value according to the content
app.get("/api/v1/content/title",authVerify,async(req,res)=>{
    try{
        const userId = req.id;
        const searchValue = req.query.searchValue;
        const content = await contentModel.find({
            userId:userId,
            title:{
                $regex:searchValue
            }
        }).populate("userId","username")
        res.status(200).json(
            content
        )
    }
    catch(e){
        res.json({
            message:"Internal server error"
        }).status(500)
    }
})


//creating a sharable link
app.post("/api/v1/brain/share",authVerify,async(req,res)=>{
    try{
        const share = req.body.share;
        const userId = req.id;
        if(share){
            //true --> create link
            //check if sharable link already exist
            const existingLink = await LinkModel.findOne({userId});

            if(existingLink){
                res.json({
                   hash:existingLink.hash
                })
                return
            }
            else{
                const sharableLink = random();
                await LinkModel.create({hash:sharableLink,userId:userId})

                res.status(200).json({
                    hash:sharableLink
                })
            }

        }
        else{
         //share --> false -.. delte link
          const response = await LinkModel.deleteOne({
            userId:userId
          })
            res.json({
                message:"link has been removed"
            }).status(200)
            }
            return;
    }
    catch(e){
        res.status(500).json({
            message:"Internal server error"
        })
        return;
    }
})
//fetching the shared link
app.get("/api/v1/brain/:shareLink",async(req,res)=>{
    try{
        const shareLink = req.params.shareLink;
        const link = await LinkModel.findOne({
            link:shareLink
        })

        //get username
        if(!link){
            res.json({
                message:"share link does not exist"
            })
            return
        }
        const user = await userModel.findOne({
            _id:link.userId
        })

        if(!user){
            res.json({
                message:"User does not exist"
            })
            return
        }

        const content = await contentModel.find({
            userId:link.userId
        })

        res.status(200).json({
            username:user.username,
            content:content
        })
    }
    catch(e){
        res.json({
            message:"Internale server error"
        })
    }
})


app.get("/",(req,res)=>{
    res.json({
        message:"your app has been started"
    })
})


app.listen(port,()=>{
    console.log("App is listening")
})


