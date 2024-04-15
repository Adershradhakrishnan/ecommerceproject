const mongoose =require ('mongoose')

const users=new mongoose.Schema({
    name:"string",
    email:"string",
    password:"string",
    role:"string"
})
module.exports=mongoose.model("users",users);