import axios from 'axios';
import './PasswordResetStyles.css';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
// PasswordReset InitialState
const PasswordReset_Initial_State = {
    userPassword: "",
    ConfirmPassword: ""
}
// Password Regex
const PassWordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
// Component
const PasswordResetComponent = () => {
    const [InputErrorResponse, setInputErrorResponse] = useState("");
    const { NavigateTo, EmailVerifyDetails, setEmailVerifyDetails } = useOutletContext();
    const [PasswordResetDetails, setPasswordResetDetails] = useState(PasswordReset_Initial_State);
    // Api Request for PasswordReset User
    const { mutate: fetchPasswordReset } = useMutation({
        mutationFn: async () => {
            const data = await axios.post("http://localhost:8080/api/auth/passwordReset", { userEmail: EmailVerifyDetails.userEmail, NewPassword: PasswordResetDetails.userPassword }, { withCredentials: true });
            return data;
        },
        onSuccess: (PasswordResetResponse) => {
            if (PasswordResetResponse?.data?.RequestStatus === "New Password updated!") {
                NavigateTo("Login");
                setEmailVerifyDetails({});
            }
        },
        onError: (PasswordResetErrorResponse) => {
            if (PasswordResetErrorResponse?.response?.data?.RequestStatus) {
                NavigateTo("VerifyEmail");
                toast.error(PasswordResetErrorResponse?.response?.data?.RequestStatus);
            }
        }
    });
    // PasswordResetForm Submission
    const handlePasswordResetSubmission = (e) => {
        e.preventDefault();
        // Validation
        if (PasswordResetDetails.userPassword === "") {
            setInputErrorResponse("PasswordReset-NewPassword");
            toast.warn("NewPassword is Required!");
            return;
        }
        else if (PasswordResetDetails.ConfirmPassword === "") {
            setInputErrorResponse("PasswordReset-ConfirmPassword");
            toast.warn("ConfirmPassword is Required!");
            return;
        }
        else if (PasswordResetDetails.userPassword !== PasswordResetDetails.ConfirmPassword) {
            setInputErrorResponse("PasswordReset-ConfirmPassword");
            toast.warn("Password fields Must be Same!");
            return;
        }
        else if (!PassWordRegex.test(PasswordResetDetails.userPassword)) {
            setInputErrorResponse("PasswordReset-NewPassword");
            toast.warn("Invalid NewPassword format!");
            return;
        }
        else if (!PassWordRegex.test(PasswordResetDetails.ConfirmPassword)) {
            setInputErrorResponse("PasswordReset-ConfirmPassword");
            toast.warn("Invalid ConfirmPassword format!");
            return;
        }
        // form Submission, Calling PasswordReset Mutate function
        fetchPasswordReset();
    }
    // handling PasswordReset Inputs
    function handlePasswordResetInputs(e) {
        setPasswordResetDetails(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }
    // 
    return (
        <div className='PasswordReset-Container'>
            <div className="Auth-Head">
                <h3>Verification</h3>
            </div>
            <button className='Back-to-Previous-Form' onClick={() => NavigateTo("VerifyEmail")}>Back</button>
            <form onSubmit={handlePasswordResetSubmission}>
                <span>
                    <b>
                        <FaLock />
                    </b>
                    <input type="password" name="userPassword" id="PasswordReset-NewPassword" placeholder='' autoComplete='off' onChange={handlePasswordResetInputs} style={(InputErrorResponse === "PasswordReset-UserPassword") ? { border: "2.3px solid tomato" } : {}} autoFocus/>
                    <label htmlFor="PasswordReset-NewPassword">Enter Password</label>
                </span>
                <span>
                    <b>
                        <FaLock />
                    </b>
                    <input type="password" name="ConfirmPassword" id="PasswordReset-ConfirmPassword" placeholder='' autoComplete='off' onChange={handlePasswordResetInputs} style={(InputErrorResponse === "PasswordReset-ConfirmPassword") ? { border: "2.3px solid tomato" } : {}} />
                    <label htmlFor="PasswordReset-ConfirmPassword">Confirm Password</label>
                </span>
                <input type="submit" value="Update" />
            </form>
        </div>
    )
}
// 
export default PasswordResetComponent;