import axios from 'axios';
import './SignupLoginStyles.css';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setUserSessionState, setUserSessionStatus } from '../../ReduxUtilities/userSessionSlice';
// Login InitialState
const Login_Initial_State = {
    userEmail: "",
    userPassword: "",
}
// Email and Password Regex
const EmailRegex = /^[\w.%+-]{4,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PassWordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
// Component
const LoginComponent = ({ setChangeForm, NavigateTo }) => {
    const dispatchUserSessionState = useDispatch();
    const [InputErrorResponse, setInputErrorResponse] = useState("");
    const [LoginDetails, setLoginDetails] = useState(Login_Initial_State);
    // Api Request for Login User
    const { mutate: fetchUserLogin } = useMutation({
        mutationFn: async () => {
            const data = await axios.post("http://localhost:8080/api/auth/login", LoginDetails, {withCredentials: true});
            return data;
        },
        onSuccess: (LoginResponse) => {
            if (LoginResponse?.data?.RequestStatus === "Login Successfully!") {
                NavigateTo('/DashBoard');
                dispatchUserSessionState(setUserSessionStatus("Access Granted!"));
                dispatchUserSessionState(setUserSessionState({ ...LoginResponse?.data?.userSessionData }));
            }
        },
        onError: (LoginErrorResponse) => {
            if (LoginErrorResponse?.response?.data?.RequestStatus) {
                dispatchUserSessionState(setUserSessionStatus("Access Denied!"));
                toast.error(LoginErrorResponse?.response?.data?.RequestStatus);
            }
        }
    });
    // LoginForm Submission
    const handleLoginSubmission = (e) => {
        e.preventDefault();
        // Validation
        if (LoginDetails.userEmail === "") {
            setInputErrorResponse("Login-UserEmail");
            toast.warn("UserEmail is Required!");
            return;
        }
        else if (LoginDetails.userPassword === "") {
            setInputErrorResponse("Login-UserPassword");
            toast.warn("UserPassword is Required!");
            return;
        }
        else if (!EmailRegex.test(LoginDetails.userEmail)) {
            setInputErrorResponse("Login-UserEmail");
            toast.warn("Invalid UserEmail format!");
            return;
        }
        else if (!PassWordRegex.test(LoginDetails.userPassword)) {
            setInputErrorResponse("Login-UserPassword");
            toast.warn("Invalid UserPassword format!");
            return;
        }
        // form Submission, Calling Login Mutate function
        fetchUserLogin();
    }
    // handling Login Inputs
    function handleLoginInputs(e) {
        setLoginDetails(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }
    // 
    return (
        <div className='Login-Container'>
            <div className="Auth-Head">
                <h3>Login</h3>
            </div>
            <form onSubmit={handleLoginSubmission}>
                <span>
                    <b>
                        <FaEnvelope />
                    </b>
                    <input type="text" name="userEmail" id="Login-UserEmail" placeholder='' autoComplete='off' onChange={handleLoginInputs} style={(InputErrorResponse === "Login-UserEmail") ? { border: "2.3px solid tomato" } : {}} />
                    <label htmlFor="Login-UserEmail">Enter Email</label>
                </span>
                <span>
                    <b>
                        <FaLock />
                    </b>
                    <input type="text" name="userPassword" id="Login-UserPassword" placeholder='' autoComplete='off' onChange={handleLoginInputs} style={(InputErrorResponse === "Login-UserPassword") ? { border: "2.3px solid tomato" } : {}} />
                    <label htmlFor="Login-UserPassword">Enter Password</label>
                </span>
                <input type="submit" value="Login" />
                <p>Forgot Password? <u onClick={() => setChangeForm(4)}>Get help</u></p>
            </form>
        </div>
    )
}
// 
export default LoginComponent;