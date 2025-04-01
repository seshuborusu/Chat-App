import "./Login.css"
import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify styles
function Login() {

    let [user, setUser] = useState({
        Email: "",
        Password: ""
    })
    const [validation, setValidation] = useState({
        Emailvalidation: "",
        Passwordvalidation: ""
    })


    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const PhoneRegex = /^[6-9][0-9]{9}$/;
    const PasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const navigate = useNavigate()
    const getuserData = (e) => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })


        if (name == "Email") {
            setValidation({ ...validation, Emailvalidation: EmailRegex.test(value) ? "" : "E-mail not in valid format" })
        }
        else if (name == "Password") {
            setValidation({ ...validation, Passwordvalidation: PasswordRegex.test(value) ? "" : "Password must be at least 8 letters include number,character" })
        }
    }
    const getData = async (e) => {
        e.preventDefault();
        if (user.Email == "" || user.Password == "") {
            toast.warning("Empty spaces not allowed")
            return
        }
        if (!EmailRegex.test(user.Email)) {
            setValidation({ ...validation, Emailvalidation: "E-mail not in valid format" })
            return
        }
        else if (!PasswordRegex.test(user.Password)) {
            setValidation({ ...validation, Passwordvalidation: "Password must be at least 8 letters include number,character" })
            return
        }
        //console.log(user);
        try {
            const resp = await axios.post("http://localhost:1997/api/users/getuser", user)
            //console.log(resp.data.message);
            if (resp.status === 200) {
                toast.success("Login success")
                localStorage.setItem("token", resp.data.message)
                navigate("/home")
                return

            }

        } catch (err) {
            console.log(err);
            if (err.response) {
                if (err.response.status === 404) {
                    toast.error("User not found. Please signup")

                } else if (err.response.status === 401) {
                    toast.error("Incorrect Password.")
                    console.log(err);
                } else {
                    toast.error("Something went wrong. Try again.")
                }
            } else {
                //alert("Server Error")
                toast.error("Network server error")
            }

        }
    }
    return (
        <div className="login-main-container  d-flex justify-content-center align-items-center  container-fluid">
            <div className=" rounded-3 shadow  col-12 col-sm-8 col-md-6 col-lg-4 p-4 p-lg-3">
                <h1 className="text-center pb-3 ">Login</h1>
                <form onSubmit={getData}>
                    <div className="w-100 ">
                        <input type="email" placeholder="E-mail" name="Email" className="form-control" onChange={getuserData} value={user.Phone} />
                        {validation.Emailvalidation && <small className="text-danger">{validation.Emailvalidation}</small>}
                    </div>
                    <div className="w-100 mt-3">
                        <input type="password" placeholder="Password" name="Password" className="form-control " onChange={getuserData} value={user.Password} />
                        {validation.Passwordvalidation && <small className="text-danger w-50 ">{validation.Passwordvalidation}</small>}
                    </div>
                    <p className="navigate-link mt-1 "><Link to={"/passwordreset"} className="text-decoration-none navigate-link " >Forgotten password?</Link></p>

                    <div className=" text-center mt-2 ">
                        <div className="w-100">
                            <button className=" py-2  rounded-3   w-50 " >Login</button>
                        </div>
                    </div>
                    <div className="mt-2 text-center">
                        <p>Don't have an account?<Link to="/signup" className="text-decoration-none text-dark fw-semibold"> <span className="fw-semibold">Sign up</span></Link></p>

                    </div>


                </form>
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
export default Login