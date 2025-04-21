import express from "express";

const app = express();

const port = 5000;

app.use(express.json())


app.post("/api/v1/signup",(req,res)=>{

})

app.post("/api/v1/signin",(req,res)=>{

})

//creating content
app.post("api/v1/content",(req,res)=>{


})

//getting content
app.get("api/v1/content",(req,res)=>{

})

//deleting content
app.delete("api/v1/delete/:id",(req,res)=>{

})


//creating a sharable link
app.post("api/v1/brain/share",(req,res)=>{

})
//fetching the shared link
app.get("api/v1/brain/share/:shareId",(req,res)=>{

})


app.get("/",(req,res)=>{
    res.json({
        message:"your app has been started"
    })
})


app.listen(port,()=>{
    console.log("App is listening")
})