const express = require("express");
const mongoose =require("mongoose")
const userSchema = mongoose.Schema({
    Name: { type: String,},
    mobNumber: { type:Number,  },
    Email: { type: String,  },
    Date: { type: String, },
    Numberofadults: { type: Number,  },
    category: { type: String,  },
    message: { type: String},
    user:{},
    locations:{}

}, { timestamps: true })
const User = mongoose.model("User", userSchema)
module.exports = User;