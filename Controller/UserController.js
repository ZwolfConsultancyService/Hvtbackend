const express = require('express');
const User = require("../Model/UserSchema")

const createUser = async (req, res) => {

    const data = req.body;
    const newUser = new User(data);

    try {
        await newUser.save();
        return res.status(201).json({
            message: "user created successfully ",
            result: newUser

        })
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const getUser=async(req,res)=>{
    try {
        const users = await User.find({})
        return res.status(200).json({
            message: "user fetched!",
            result: users
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
const deleteUser = async (req, res) => {
    const id = req.params.id

    try {
        const user = await User.findOne({
            _id: id
        })

        if (!user)
            return res.status(404).json({
                message: 'user not found '
            })

        await User.findByIdAndDelete(id)
        return res.status(200).json({
            message: 'user Deleted ',
            result: user
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message

        })
    }
}

module.exports={
createUser,
getUser,
deleteUser
};
