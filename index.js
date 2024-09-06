const express = require("express");
const mongoose=require("mongoose");
const bodyParser=require('body-parser')
const userRoute=require("./Routes/UserRoutes.js")
const adminroutes=require("./Routes/adminroutes.js")
const cors=require('cors')
const morgan=require("morgan")
require("dotenv").config()

const app = express()
app.use(cors())

app.use(bodyParser.json({extended:true,limit:"5mb"}))
app.use(bodyParser.urlencoded({extended:true,limit:"5mb"}))
app.use(express.json({extended:true,limit:"5mb"}))
app.use(express.urlencoded({extended:true,limit:"5mb"}))

app.use(morgan("dev"))
app.use("/user",userRoute) 
app.use("/admin",adminroutes)
app.use("/ ", (req, res) => {
    res.send('server is running  ')
});

mongoose.connect(process.env.mongoDB_URL,{})
    .then(() => {
        app.listen(process.env.Port, () => {
            console.log("server is up and running");
            console.log("connected to the database");
        })

    })
    .catch((err) => {
        console.log(err.message);
    })


