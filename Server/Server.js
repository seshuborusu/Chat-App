const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const secret_key = "ssss55422"
const connetcDb = require("./config/connection")
const model = require("./config/userSchema")
const Route=require("./Routes/userRoute")


const app = express()
app.use(express.json())
app.use(cors())

connetcDb();

app.use("/api/users",Route)
app.use("/api/users",Route)
app.use("/api/users",Route)
app.use("/api/users",Route)
app.use("/api/users",Route)


app.post("/data", async (req, res) => {
    const newuser = req.body;
    const user = new model(newuser)
    await user.save()
    //const data= await model.find()
    //console.log(data);  

})


app.listen(1997, () => {
    console.log("server Started");
})