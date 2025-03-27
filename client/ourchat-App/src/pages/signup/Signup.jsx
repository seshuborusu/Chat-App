import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Successmodal from './Successmodel';  // Assuming Successmodal is the modal component
import './Signup.css';
import { ToastContainer, toast } from 'react-toastify';

function Signup() {
    const [user, setUser] = useState({
        Fname: '',
        Lname: '',
        Gender: '',
        Phone: '',
        Password: '',
        Email: ""
    });

    const [validation, setValidation] = useState({
        Fnamevalidation: '',
        Lnamevalidation: '',
        Phonevalidation: '',
        Passwordvalidation: '',
        Emailvalidation: ""
    });

    const [openmodel, setOpenmodel] = useState(false); // State to manage modal visibility
    const navigate = useNavigate();

    // Regular expressions for validation
    const FnameRegex = /^[^\s][A-Za-z\s]{2,30}[^\s]$/;
    const LnameRegex = /^[^\s][A-Za-z\s]{2,30}[^\s]$/;
    const PhoneRegex = /^[6-9][0-9]{9}$/;
    const PasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Handle input change and validation
    const getUserdetails = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });

        if (name === 'Fname') {
            setValidation({
                ...validation,
                Fnamevalidation: FnameRegex.test(value) ? '' : 'Must contain only letters'
            });
        } else if (name === 'Lname') {
            setValidation({
                ...validation,
                Lnamevalidation: LnameRegex.test(value) ? '' : 'Must contain only letters'
            });
        } else if (name === 'Phone') {
            setValidation({
                ...validation,
                Phonevalidation: PhoneRegex.test(value) ? '' : 'Must contain valid numbers'
            });
        } else if (name === 'Password') {
            setValidation({
                ...validation,
                Passwordvalidation: PasswordRegex.test(value)
                    ? ''
                    : 'Password must be at least 8 letters include number, character'
            });
        } else if (name == "Email") {
            setValidation({ ...validation, Emailvalidation: EmailRegex.test(value) ? "" : "Email not in valid format" })
        }
    };

    // Handle form submission
    const sendData = async (event) => {
        event.preventDefault();

        if (user.Fname === '' || user.Phone == null || user.Password === '') {
            //alert('Please Enter All Details...');
            toast.warning("Please enter all fields.")
            return;
        }

        if (!PhoneRegex.test(user.Phone)) {
            setValidation({
                ...validation,
                Phonevalidation: 'Starts with 6-9 and contains 10 numbers'
            });
            return;
        }

        if (!PasswordRegex.test(user.Password)) {
            setValidation({
                ...validation,
                Passwordvalidation: 'Password must be at least 8 letters include number,character '
            });
            return;
        }
        if(!EmailRegex.test(user.Email)){
            setValidation({...validation,Emailvalidation:"Email is not in froamt"})
        }

        try {
            const res = await axios.post('http://localhost:1997/api/users/adduser', user);
            if (res.status === 201) {
                setOpenmodel(true);  // Open modal after successful registration
                setUser({
                    Fname: '',
                    Lname: '',
                    Phone: '',
                    Password: '',
                    Email:""
                });
                setTimeout(() => {
                    navigate("/login")
                }, 3000)
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                toast.info(err.response.data.message)
            } else {
                toast.error("Error: " + err.message)
            }
        }
    };


    ;
    // Close modal function
    const closeModel = () => {
        setOpenmodel(false);  // Close the modal by setting openmodel to false
        navigate('/login');  // Navigate to login page after closing the modal
    };

    return (
        <div className="sign d-flex justify-content-center align-items-center container-fluid">
            <div className="signup-main-container rounded-3 shadow p-lg-5 p-3 col-12 col-sm-8 col-md-6 col-lg-5">
                <h1 className="text-center pb-3">Signup</h1>
                <form onSubmit={sendData}>
                    <div className="signup-container">
                        <div className="row">
                            <div className="col-6">
                                <input
                                    type="text"
                                    placeholder="First name"
                                    onChange={getUserdetails}
                                    name="Fname"
                                    className="form-control"
                                    value={user.Fname}
                                />
                                {validation.Fnamevalidation && <small className="text-danger">{validation.Fnamevalidation}</small>}
                            </div>
                            <div className="col-6">
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    onChange={getUserdetails}
                                    name="Lname"
                                    className="form-control"
                                    value={user.Lname}
                                />
                                {validation.Lnamevalidation && <small className="text-danger">{validation.Lnamevalidation}</small>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <input
                                    type="number"
                                    placeholder="Phone number"
                                    onChange={getUserdetails}
                                    name="Phone"
                                    className="form-control"
                                    value={user.Phone}
                                />
                                {validation.Phonevalidation && <small className="text-danger">{validation.Phonevalidation}</small>}
                            </div>
                        </div>
                        <div className='row'>
                        <div className="col-12">
                                <input
                                    type="text"
                                    placeholder="E-mail"
                                    onChange={getUserdetails}
                                    name="Email"
                                    className="form-control"
                                    value={user.Email}
                                />
                                {validation.Emailvalidation && <small className="text-danger">{validation.Emailvalidation}</small>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    onChange={getUserdetails}
                                    name="Password"
                                    className="form-control"
                                    value={user.Password}
                                />
                                {validation.Passwordvalidation && <small className="text-danger ">{validation.Passwordvalidation}</small>}
                            </div>
                        </div>
                        <p>
                            Already have an account?
                            <Link to="/login" className="text-decoration-none text-dark">
                                <span className="fw-semibold"> Login</span>
                            </Link>
                        </p>
                    </div>

                    <div className="row text-center">
                        <div className="col-12">
                            <button className="py-2 rounded-3 w-50 ">Register</button>
                        </div>
                        {/* Show the modal if openmodel state is true */}
                        {openmodel && <Successmodal modelo={openmodel} closeModel={closeModel} />}
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
    );
}

export default Signup;
