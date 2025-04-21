import express from "express";

const app = express();

const port = 5000;

app.use(express.json())

app.get("/",(req,res)=>{
    res.json({
        message:"your app has been started"
    })
})


app.listen(port,()=>{
    console.log("App is listening")
})