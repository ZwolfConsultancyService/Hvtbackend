const express =require("express")
const adminmodel=require("../Model/adminschema")
const bcrypt = require("bcrypt")

const jwt=require ("jsonwebtoken")
const admin = require("../Model/adminschema")
// const jwt = require('jsonwebtoken')

require("dotenv").config()

const createadmin = async (req, res) => {
    const data = req.body;
    const newadmin = new adminmodel(data);
  try {
    const emailExist = await admin.findOne({
        email: data.email
    })
        if (emailExist) {
            return res.status(400).json({
                message: "Email already exist"
            })
        }
        const hashedPassword = await bcrypt.hash(data.password, 10)
        newadmin.password = hashedPassword
        await newadmin.save();
        return res.status(201).json({
            message: "admin created successfully ",
            result: newadmin

        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const login =async(req,res)=>{

    const { email, password } = req.body;
    
            try {
            const admin = await adminmodel.findOne({
                email: "admin@gmail.com"
            })
            if (!admin) {
                return res.status(401).json({
                    message: "Email is incorrect!"
                });
            }
            const result = await bcrypt.compare(password, admin.password)
            if (!result) {
                return res.status(400).json({
                    message: "invalid password"
                })
            }
            let payload = admin.toObject()
            const token = jwt.sign(payload, process.env.secret_key)
            return res.status(200).json({
                message: "User Logged in Successfully",
                token: token,
                result: admin
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
module.exports={
    createadmin,
    login
}