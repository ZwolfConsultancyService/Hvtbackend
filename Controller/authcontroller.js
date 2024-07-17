const admin=require("../Model/adminschema")
const bcrypt=require("bcrypt")
const jwt=require ("jsonwebtoken")
require("dotenv").config()


const login =async(req,res)=>{

const { email, password } = req.body;

    try {
        const admin = await admin.findOne({
            email: email ,
        })
        if (!admin) {
            return res.status(401).json({
                message: "Email is incorrect!"
            });
        }
        const result = await bcrypt.compare(password, user.password)
        if (!result) {
            return res.status(400).json({
                message: "invalid password"
            })
        }
        let payload = {admin}
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
    login
}