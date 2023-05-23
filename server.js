const express = require("express");
//////password NVYz9yXxqgH8MWY1  database name icloudsoft
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const {urlencoded}= require("body-parser")
const cookieParser = require("cookie-parser");
const cors = require('cors');
const bodyParser = require('body-parser');
// const cors = require('cors');
require('dotenv').config();

const path =require('path')

const app = express();


app.use(cors({credentials: true, origin: "https://icloudsoft.onrender.com:5050);  
app.use(bodyParser.json());
// app.use(cors({credentials: true, origin: "http://localhost:3002"}));            ////middleware  
app.use(urlencoded({extended:true}))
app.use(express.json());                        / ///middleware
app.use(cookieParser());   
// app.use(cors());                     ////middleware

app.use("/api",router);  


app.use(express.static(path.join(__dirname,'./client/build')))
app.get(
    "*",(req,res)=>{
        res.sendFile(path.join(__dirname, './client/build/index.html'))
    }
)

mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.uzwronn.mongodb.net/iCloudSoft?retryWrites=true&w=majority`).then(() => {
    app.listen(5050);
    console.log("Database is connected , Listening to localhost 5050");
}).catch((err)=> {
    console.log(err);
})


// mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.ljmc8lh.mongodb.net/icloudsoft?retryWrites=true&w=majority`).then(() => {
//     app.listen(5050);
//     console.log("Database is connected , Listening to localhost 5050");
// }).catch((err)=> {
//     console.log(err);
// })
