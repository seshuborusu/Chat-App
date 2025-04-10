import { Link, Navigate, useNavigate } from "react-router-dom"
import "./Forgotpassword.css"
import { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import axios from "axios"
function Forgotpassword() {

    const [email, setEmail] = useState('')
    const [recotp, setRecotp] = useState(false)//for dynamic ui 
    const [otp, setOtp] = useState()//for getting otp from field
    const [loading, setLoading] = useState(false)
    const [validation, setValidation] = useState()
    const [timer, setTimer] = useState(5); // Initialize timer with 5 seconds
    const [redirecting, setRedirecting] = useState(false);
    const navigate = useNavigate()

    const otpRegex = /^[0-9]+$/
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;




    const sendOtprequest = async () => {
        if (email == '') {
            console.log(email);
            toast.error("Enter valid E-mail")
            return
        }
        else if (!EmailRegex.test(email)) {
            setValidation(EmailRegex.test(email) ? "" : "E-mail not in valid format")
            return
        }
        //console.log(email);
        setLoading(true)
        try {
          //  console.log(email, "d");
            const resp = await axios.post("http://localhost:1997/api/users/password-reset", { email })
            console.log(resp.status);
            if (resp.status === 200) {
                toast.success("OTP sent")
                setRecotp(true)

            }

        } catch (err) {
            console.log(err.response);
            if (err.response) {
                if (err.response.status === 400) {
                    toast.error("Account not found with this E-mail")
                } else if (err.response.status === 500) {
                    toast.error("Internal server Error. Try again.")
                } else {
                    toast.error("Something went wrong")
                }

            } else {
                toast.error("Network error")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleOtp = async () => {
        setLoading(true)
        if (!otpRegex.test(otp)) {
            toast.error("Otp contain numbers")
        } else {
            try {
                console.log(otp);
                const resp = await axios.post("http://localhost:1997/api/users/validate-otp", { email, otp })
                if (resp.status === 200) {
                    toast.success('OTP Verified Successfully!');
                    sessionStorage.setItem('email', resp.data.email); // Stores 'john_doe' under the key 'username'
                    setRedirecting(true)
                    const countdown = setInterval(() => {

                        setTimer((prev) => {
                            if (prev === 1) {
                                clearInterval(countdown);
                                navigate("/updatepassword"); // Navigate after countdown
                            }
                            return prev - 1;
                        });
                    }, 1000);
                }
            } catch (err) {
                console.log(err);
                // Handle backend errors based on status codes
                if (err.response) {
                    // Handle 400 Bad Request status
                    if (err.response.status === 400) {
                        if (err.response.data.message === 'Invalid OTP') {
                            toast.error('The OTP you entered is incorrect. Please try again.');
                        } else if (err.response.data.message === 'Email Not Found') {
                            toast.error('No account found with the provided email. Please check your email address.');
                        } else if (err.response.data.message === 'OTP Expired') {
                            toast.error('Your OTP has expired. Please request a new one.');
                        }
                    }
                    // Handle 500 Internal Server Error
                    else if (err.response.status === 500) {
                        toast.error('Server error occurred. Please try again later.');
                    }
                } else {
                    // Handle network errors or unexpected issues
                    toast.error('Network error. Please check your internet connection.');
                }
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div>
            {recotp ? <div className="container-fluid d-flex flex-column justify-content-center align-items-cent forgotmain-container">

                <div className=" container  d-flex flex-column  justify-content-center shadow  rounded-3 p-lg-4  p-2 py-5  col-12 col-sm-8 col-md-6 col-lg-4 ">
                    <div><h3 className="text-start mb-3">Verify OTP</h3>
                        <div > <p className="p-3 border  text-center bg-light bg-secondary rounded-3 text-success fw-normal">OTP sent to your email</p></div>
                    </div>
                    {/* <label className="fw-semibold my-1 mt-4">Your Email</label> */}
                    <div className="w-100 mt-4">
                        <input type="number" placeholder="One time password" className="form-control" onChange={(e) => {
                            setOtp(e.target.value)
                        }} />
                    </div>
                    <div className="mt-3 w-100 text-center"> <button className="w-100 p-1 py-2 rounded-3 fw-normal" disabled={loading} onClick={handleOtp}>{loading ? "Verifying..." : "Verify OTP"}</button></div>
                    <p className=" mt-2 navigate-link cursor-pointer" >Don't receive OTP? <span onClick={() => { setRecotp(false) }} className="resend-otp-link">Resend</span> </p>
                    {redirecting && (
                        <div className="mt-2 text-center ">
                            <p>Wait.. You will be redirected in {timer} seconds...</p>
                            {/* Optional: Add a spinner or progress bar */}
                            <div className="spinner-border fw-semibold" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>


            </div>
                :
                <div className="container-fluid d-flex flex-column justify-content-center align-items-cent forgotmain-container">

                    <div className=" container  d-flex flex-column  justify-content-center shadow  rounded-3 p-lg-4  p-3   col-12 col-sm-8 col-md-6 col-lg-4">
                        <div><h3 className="text-start">Reset Your Password</h3>
                            <small>Enter the email associated to your account and we'll send you password reset OTP.</small>
                        </div>
                        {/* <label className="fw-semibold my-1 mt-4">Your Email</label> */}
                        <div className="w-100 mt-4">
                            <input type="email" placeholder="E-mail" className="form-control" onChange={(e) => { setEmail(e.target.value) }} />
                            {validation && <small className="text-danger px-2">{validation}</small>}
                        </div>
                        <div className="mt-3  text-center"> <button className="w-50 p-1 py-2 rounded-3 fw-normal" disabled={loading} onClick={sendOtprequest}>{loading ? "Sending OTP" : "Reset password"}</button></div>
                        <p className=" mt-2"> <Link to={"/"} className="text-decoration-none mt-1 navigate-link">  Return to Login</Link></p>
                    </div>

                </div>
            }
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={true}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnHover={false}


            />
        </div>
    )
}
export default Forgotpassword