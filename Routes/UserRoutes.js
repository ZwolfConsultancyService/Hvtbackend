const express=require("express")
const {createUser,getUser,deleteUser}= require("../Controller/UserController")

const router=express.Router()

router.post("/create", createUser)

router.get("/get-user", getUser)
router.delete("/delete/:id",deleteUser)



module.exports = router