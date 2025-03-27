const mongoose=require("mongoose")

async function connetcDb(){
 //await mongoose.connect("mongodb://localhost:27017")
 await mongoose.connect("mongodb://localhost:27017/ourchat-app")
 //console.log("k");
}

module.exports=connetcDb