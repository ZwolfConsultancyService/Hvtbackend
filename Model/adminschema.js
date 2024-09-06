const express = require("express")
const mongoose = require("mongoose")
const adminschema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, require: true },
    otp: { type: Number, required: false },
    otpExpiresAt: { 
        type: Date, 
        required: false, 
        index: { expires: '10m' } 
    }
})
const Admin = mongoose.model("Admin", adminschema);
module.exports = Admin