import { useState } from "react"
import "./Updatepassword.css"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
function Updatepassword() {

    const [newpassword, setnewPassword] = useState({
        password: "", conformpassword: ""
    })
    const [validation, setValidation] = useState({
        passwordvalidation: "",
        cnfrmpasswordvalidation: ""
    })
    const [timer, setTimer] = useState(5); // Initialize timer with 5 seconds
    const [redirecting, setRedirecting] = useState(false);
    const navigate = useNavigate()
    const PasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    const getPassword = (e) => {
        const { name, value } = e.target
        setnewPassword({ ...newpassword, [name]: value })
        if (name == "password") {
            setValidation({ ...validation, passwordvalidation: PasswordRegex.test(value) ? "" : "Password must be at least 8 letters include number,character" })
            return
        }
        else if (name == "conformpassword") {
            setValidation({ ...validation, cnfrmpasswordvalidation: PasswordRegex.test(value) ? "" : "Password must be at least 8 letters include number,character" })
            return
        }
    }
    const email = sessionStorage.getItem("email")

    async function handlePasswordreq() {
        if (!PasswordRegex.test(newpassword.password) || !PasswordRegex.test(newpassword.password)) {
            toast.warning("Enter valid password")
            return
        }
        if (newpassword.password !== newpassword.conformpassword) {
            toast.info("password not match")
            console.log(newpassword);
            return
        }

        try {
            const response = await axios.post("http://localhost:1997/api/users/updatepassword", { email, newpassword })
            if (response.status === 200) {

                toast.success("Password updated successfully!");
                //console.log("succes");
                setRedirecting(true)
                const countdown = setInterval(() => {

                    setTimer((prev) => {
                        if (prev === 1) {
                            clearInterval(countdown);
                            navigate("/login"); // Navigate after countdown
                        }
                        return prev - 1;
                    });
                }, 1000);


            }
        } catch (error) {
            //console.log("sdddd", error);
            if (error.response) {
                // Handle error response from the server
                toast.error(error.response.data.message);
            } else {
                // Network error or other errors
                toast.error("Something went wrong. Please try again later.");
            }
            toast.error(error);
        }

    }
    return (
        <div className="updatepassword-main-container">
            <div className="container-fluid d-flex flex-column justify-content-center align-items-cent forgotmain-container">

                <div className=" container  d-flex flex-column  justify-content-center shadow  rounded-3 p-lg-5  p-3 py-5  col-12 col-sm-8 col-md-6 col-lg-5">
                    <div><h3 className="text-center ">Change your password</h3>
                        <small className="px-3">Enter a new password below to change your password.</small>
                    </div>
                    <div className=" mt-3">
                        <input type="text" placeholder="E-mail" className="form-control" value={email} disabled />
                    </div>
                    <div className="my-3">
                        <input type="text" placeholder="New password" className="form-control" onChange={getPassword} name="password" />
                        {validation.passwordvalidation && <small className="text-danger">Password must be at least 8 letters include number,character</small>}
                    </div>
                    <div className="">
                        <input type="text" placeholder="Confirm new password" className="form-control" onChange={getPassword} name="conformpassword" />
                        {validation.cnfrmpasswordvalidation && <small className="text-danger">Password must be at least 8 letters include number,character</small>}

                    </div>
                    <div className="text-center mt-3 "><button className="rounded-3 py-2 px-3" onClick={handlePasswordreq}>Update password</button></div>
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
export default Updatepassword