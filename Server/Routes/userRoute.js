const express = require("express")
const model = require("../config/userSchema")
const jwt = require("jsonwebtoken");
const secretKey = "Seshu15454512";
const bcrypt = require('bcrypt');

const Route = express.Router()



Route.post("/adduser", async (req, res) => {
    try {
        const newuser = req.body;
        const { Phone, Email, Password } = newuser;

        // Check if the email already exists in the database
        const olduser = await model.findOne({ Email });
        // console.log(olduser); // For debugging
        console.log("Password before hashing:", Password);


        if (olduser == null) {
            // Hash the password before saving it
            const hashedPassword = await bcrypt.hash(Password, 10); // 10 is the salt rounds
            newuser.Password = hashedPassword; // Replace the plain password with the hashed password
            console.log("Hashed Password:", hashedPassword);
            // Create a new user object and save it to the database
            const user = new model(newuser);
            const savedUser = await user.save();

            res.status(201).json({
                ok: true,
                message: "User created successfully",
                user: savedUser
            });
        } else {
            res.status(400).json({
                ok: false,
                message: "Email already exists"
            });
        }
    } catch (err) {
        console.log(err);
        console.error("Error adding user:", err);

        // Send a failure response
        res.status(500).json({
            message: "Server error while adding user",
            error: err.message
        });
    }
});
Route.post("/getuser", async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // Find the user by email
        const existuser = await model.findOne({ Email });
        // console.log(existuser, "s");

        if (!existuser) {
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(Password, existuser.Password);
        console.log("Password entered:", Password);
        console.log("Hashed password in DB:", existuser.Password);
        if (!isPasswordValid) {
            return res.status(401).json({
                ok: false,
                message: "Password incorrect"
            });
        }

        // If password is correct, generate a JWT token
        const payload = {
            phone: existuser.Phone,
            email: existuser.Email
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // You can change the expiration

        // Return the token
        res.status(200).json({
            ok: true,
            message: "Login successful",
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            message: "Server error while fetching user",
            error: err.message
        });
    }
});

Route.post("/password-reset", async (req, res) => {
    try {
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        const { email } = req.body;

        const responseType = {};

        let user = await model.findOne({ Email: email });

        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }
        else {
            // Update the user with the new OTP
            user.otp = otpCode;
            await user.save();
            console.log("otp is" + user.otp);
            responseType.statusText = "Success";
            responseType.message = `OTP has been sent to ${email}`;

            // Send email
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                service: 'gmail',
                port: 465,
                secure: true,
                auth: {
                    user: "borususeshu@gmail.com",
                    pass: 'hepx ongq qvpm vrwl'
                }
            });

            const mailOptions = {
                from: 'borususeshu@gmail.com',
                to: email,
                subject: 'Ourchat-app Forgot Password',
                html:
                    `<div>
                    <p>Dear ${user.Fname} ${user.Lname},</p>
                    <p>Your OTP is ${otpCode}. Do not share it with anyone. This is confidential and should be used by you only.</p>
                    <div>Warm regards,</div>
                    <div>Our chat-app</div>
                </div>`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json(responseType);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            statusText: "error",
            message: "Internal Server Error at Forgot Password OTP",
        });
    }
})

Route.post("/validate-otp", async (req, res) => {
    const { otp, email } = req.body
    console.log(req.body);
    try {
        const isMailExists = await model.findOne({ Email: email })
        if (isMailExists) {
            if (isMailExists.otp === Number(otp)) {
                return res.status(200).json({ message: 'Valid OTP', email: email });
            }
            else {
                return res.status(400).json({ message: 'Invalid OTP' });
            }
        }
        else {
            return res.status(400).json({ message: 'Email Not Found' });
        }


    } catch (error) {
        console.log(error.message, 'OTP Verification');
        return res.status(500).json({ message: 'Internal server error at Forgot Password OTP Verification' })
    }
})

Route.post("/updatepassword", async (req, res) => {
    console.log(req.body);
    try {
        const { email, newpassword } = req.body;
        // console.log(newpassword);
        const password = newpassword.password
        // console.log(password);
        const isCustomerExist = await model.findOne({ Email: email });
        //.log(isCustomerExist);
        if (isCustomerExist) {
            const hashedPassword = await bcrypt.hash(password, 10);
            isCustomerExist.Password = hashedPassword;
            await isCustomerExist.save()
            return res.status(200).json({ message: 'New Password Updated' })
        }
        else {
            return res.status(400).json({ message: 'Customer Mail ID Not Found!' })
        }
    }
    catch (error) {
        console.log('Error at Updating Password', error);
        return res.status(500).json({ error: "Internal Server Error at Updation of Password" });
    }
})
module.exports = Route