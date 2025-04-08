import axios from 'axios';
import './PasswordResetStyles.css';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';
// Email and Password Regex
const EmailRegex = /^[\w.%+-]{4,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
// Component
const EmailVerifyComponent = () => {
    const { NavigateTo, EmailVerifyDetails, setEmailVerifyDetails } = useOutletContext();
    const [InputErrorResponse, setInputErrorResponse] = useState("");
    // Api Request for EmailVerify User
    const { mutate: fetchUserEmailVerify } = useMutation({
        mutationFn: async () => {
            const data = await axios.post("http://localhost:8080/api/auth/verifyEmail", EmailVerifyDetails, {withCredentials: true});
            return data;
        },
        onSuccess: (EmailVerifyResponse) => {
            if (EmailVerifyResponse?.data?.RequestStatus === "Email Sent Successfully!") {
                NavigateTo("VerifyCode");
            }
        },
        onError: (EmailVerifyErrorResponse) => {
            if (EmailVerifyErrorResponse?.response?.data?.RequestStatus) {
                NavigateTo("Login");
                toast.error(EmailVerifyErrorResponse?.response?.data?.RequestStatus);
            }
        }
    });
    // EmailVerifyForm Submission
    const handleEmailVerifySubmission = (e) => {
        e.preventDefault();
        // Validation
        if (EmailVerifyDetails.userName === "") {
            setInputErrorResponse("EmailVerify-UserName");
            toast.warn("userName is Required!");
            return;
        }
        else if (EmailVerifyDetails.userEmail === "") {
            setInputErrorResponse("EmailVerify-UserEmail");
            toast.warn("UserEmail is Required!");
            return;
        }
        else if (!EmailRegex.test(EmailVerifyDetails.userEmail)) {
            setInputErrorResponse("EmailVerify-UserEmail");
            toast.warn("Invalid UserEmail format!");
            return;
        }
        // form Submission, Calling EmailVerify Mutate function
        fetchUserEmailVerify();
    }
    // handling EmailVerify Inputs
    function handleEmailVerifyInputs(e) {
        setEmailVerifyDetails(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }
    // 
    return (
        <div className='EmailVerify-Container'>
            <div className="Auth-Head">
                <h3>Verification</h3>
            </div>
            <button className='Back-to-Previous-Form' onClick={() => NavigateTo("Login")}>Back</button>
            <form onSubmit={handleEmailVerifySubmission}>
                <span>
                    <b>
                        <FaUser />
                    </b>
                    <input type="text" name="userName" id="EmailVerify-UserName" placeholder='' autoComplete='off' onChange={handleEmailVerifyInputs} style={(InputErrorResponse === "EmailVerify-UserName") ? { border: "2.3px solid tomato" } : {}} autoFocus />
                    <label htmlFor="EmailVerify-UserName">Enter UserName</label>
                </span>
                <span>
                    <b>
                        <FaEnvelope />
                    </b>
                    <input type="email" name="userEmail" id="EmailVerify-UserEmail" placeholder='' autoComplete='off' onChange={handleEmailVerifyInputs} style={(InputErrorResponse === "EmailVerify-UserEmail") ? { border: "2.3px solid tomato" } : {}} />
                    <label htmlFor="EmailVerify-UserEmail">Enter Email</label>
                </span>
                <input type="submit" value="Verify" />
            </form>
        </div>
    )
}
// 
export default EmailVerifyComponent;