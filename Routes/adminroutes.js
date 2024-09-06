const express=require("express")

const {createadmin,login,resetPassword,requestPasswordReset,verifyOTP}=require("../Controller/adminController")
// const {login}=require("../Controller/authcontroller")
const Arouter=express.Router()


Arouter.post("/create-admin",createadmin)
Arouter.post("/login",login) 
Arouter.post("/request-password-reset", requestPasswordReset);
Arouter.post("/reset-password", resetPassword);
Arouter.post("/otp-verification", verifyOTP);

module.exports = Arouter