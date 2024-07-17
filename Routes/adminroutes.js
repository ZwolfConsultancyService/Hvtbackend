const express=require("express")

const {createadmin,login}=require("../Controller/adminController")
// const {login}=require("../Controller/authcontroller")
const Arouter=express.Router()


Arouter.post("/create-admin",createadmin)
Arouter.post("/login",login) 

module.exports = Arouter