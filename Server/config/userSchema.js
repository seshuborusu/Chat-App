const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    Fname:String,
    Lname:String,
    Gender:String,
    Phone:Number,
    Password:String,
    Email:String,
    otp:Number

})

const usermodel=mongoose.model("user",userSchema)
module.exports= usermodel