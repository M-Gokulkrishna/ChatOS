import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { setUserSessionState, setUserSessionStatus } from '../../ReduxUtilities/userSessionSlice.js';
// Signup InitialState
const Signup_Initial_State = {
    userName: "",
    userEmail: "",
    userPassword: "",
}
// Email and Password Regex
const EmailRegex = /^[\w.%+-]{4,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PassWordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
// Component
const SignupComponent = () => {
    const { NavigateTo } = useOutletContext();
    const dispatchUserSessionState = useDispatch();
    const [InputErrorResponse, setInputErrorResponse] = useState("");
    const [SignupDetails, setSignupDetails] = useState(Signup_Initial_State);
    // Api Request for Signup User
    const { mutate: fetchUserSignup } = useMutation({
        mutationFn: async () => {
            const data = await axios.post("http://localhost:8080/api/auth/register", SignupDetails, { withCredentials: true });
            return data;
        },
        onSuccess: (SignupResponse) => {
            if (SignupResponse?.data?.RequestStatus === "Account Created!") {
                NavigateTo("EditProfile");
                dispatchUserSessionState(setUserSessionStatus("Access Granted!"));
                dispatchUserSessionState(setUserSessionState(SignupResponse?.data?.userSessionData));
            }
        },
        onError: (SignupErrorResponse) => {
            if (SignupErrorResponse?.response?.data?.RequestStatus) {
                NavigateTo("Login");
                dispatchUserSessionState(setUserSessionStatus("Access Denied!"));
                toast.error(SignupErrorResponse?.response?.data?.RequestStatus);
            }
        }
    });
    // SignupForm Submission
    const handleSignupSubmission = (e) => {
        e.preventDefault();
        // Validation
        if (SignupDetails.userName === "") {
            setInputErrorResponse("Signup-UserName");
            toast.warn("userName is Required!");
            return;
        }
        else if (SignupDetails.userEmail === "") {
            setInputErrorResponse("Signup-UserEmail");
            toast.warn("UserEmail is Required!");
            return;
        }
        else if (SignupDetails.userPassword === "") {
            setInputErrorResponse("Signup-UserPassword");
            toast.warn("UserPassword is Required!");
            return;
        }
        else if (!EmailRegex.test(SignupDetails.userEmail)) {
            setInputErrorResponse("Signup-UserEmail");
            toast.warn("Invalid UserEmail format!");
            return;
        }
        else if (!PassWordRegex.test(SignupDetails.userPassword)) {
            setInputErrorResponse("Signup-UserPassword");
            toast.warn("Invalid UserPassword format!");
            return;
        }
        // form Submission, Calling Signup Mutate function
        fetchUserSignup();
    }
    // handling Signup Inputs
    function handleSignupInputs(e) {
        setSignupDetails(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }
    // 
    return (
        <div className='Signup-Container'>
            <div className="Auth-Head">
                <h3>Register</h3>
            </div>
            <form onSubmit={handleSignupSubmission}>
                <span>
                    <b>
                        <FaUser />
                    </b>
                    <input type="text" name="userName" id="Signup-UserName" placeholder='' autoComplete='off' onChange={handleSignupInputs} style={(InputErrorResponse === "Signup-UserName") ? { border: "2.3px solid tomato" } : {}} autoFocus />
                    <label htmlFor="Signup-UserName">Enter UserName</label>
                </span>
                <span>
                    <b>
                        <FaEnvelope />
                    </b>
                    <input type="text" name="userEmail" id="Signup-UserEmail" placeholder='' autoComplete='off' onChange={handleSignupInputs} style={(InputErrorResponse === "Signup-UserEmail") ? { border: "2.3px solid tomato" } : {}} />
                    <label htmlFor="Signup-UserEmail">Enter Email</label>
                </span>
                <span>
                    <b>
                        <FaLock />
                    </b>
                    <input type="text" name="userPassword" id="Signup-UserPassword" placeholder='' autoComplete='off' onChange={handleSignupInputs} style={(InputErrorResponse === "Signup-UserPassword") ? { border: "2.3px solid tomato" } : {}} />
                    <label htmlFor="Signup-UserPassword">Enter Password</label>
                </span>
                <input type="submit" value="Register" />
            </form>
        </div>
    )
}
// 
export default SignupComponent;