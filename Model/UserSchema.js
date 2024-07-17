const express = require("express");
const mongoose =require("mongoose")
const userSchema = mongoose.Schema({
    Name: { type: String, required: true },
    mobNumber: { type:Number, required: true },
    Email: { type: String, required: true },
    Date: { type: String, require: true },
    Numberofadults: { type: Number, require: true },
    category: { type: String, require: true },
    message: { type: String}

}, { timestamps: true })
const User = mongoose.model("User", userSchema)
module.exports = User;