import jwt, { JwtPayload } from "jsonwebtoken"
import { JwtSecret } from "./config";
import { Request, Response, NextFunction } from "express";


export const authVerify = (req:Request,res:Response,next:NextFunction)=>{
   try{
        const token = req.headers.authorization; 
        if(!token){
            res.status(500).json({
                message:"internal server error"
            })
            return;
        }
        const user = jwt.verify(token,JwtSecret as string);
        if(user){
            req.id = (user as JwtPayload).id;
            next()
        }
   }
   catch(e){
      res.json({
        message:"Internal server error"
      }).status(500)
   }  
}


  


