import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
// PasswordReset InitialState
const PasswordReset_Initial_State = {
    userPassword: "",
    ConfirmPassword: ""
}
// Password Regex
const PassWordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
// Component
const PasswordResetComponent = () => {
    const [PasswordResetDetails, setPasswordResetDetails] = useState(PasswordReset_Initial_State);
    const [InputErrorResponse, setInputErrorResponse] = useState("");
    // Api Request for PasswordReset User
    const { mutate: fetchPasswordReset } = useMutation({
        mutationFn: async () => {
            const data = await axios.post("http://localhost:8080/api/auth/passwordReset", { userPassword: PasswordResetDetails.userPassword });
            return data;
        },
        onSuccess: (PasswordResetResponse) => {
            if (PasswordResetResponse?.data?.RequestStatus === "Password Reset Successfully!") {
                // 
            }
        },
        onError: (PasswordResetErrorResponse) => {
            if (PasswordResetErrorResponse?.response?.data?.RequestStatus) {
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
        // fetchPasswordReset();
    }
    // handling PasswordReset Inputs
    function handlePasswordResetInputs(e) {
        setPasswordResetDetails(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }
    // 
    return (
        <div className='PasswordReset-Container'>
            <form onSubmit={handlePasswordResetSubmission}>
                <span>
                    <label htmlFor="PasswordReset-NewPassword">Enter Password</label>
                    <input type="text" name="userPassword" id="PasswordReset-NewPassword" placeholder='' autoComplete='off' onChange={handlePasswordResetInputs} style={(InputErrorResponse === "PasswordReset-UserPassword") ? { border: "2.3px solid tomato" } : {}} />
                </span>
                <span>
                    <label htmlFor="PasswordReset-ConfirmPassword">Enter Password</label>
                    <input type="text" name="ConfirmPassword" id="PasswordReset-ConfirmPassword" placeholder='' autoComplete='off' onChange={handlePasswordResetInputs} style={(InputErrorResponse === "PasswordReset-ConfirmPassword") ? { border: "2.3px solid tomato" } : {}} />
                </span>
                <input type="submit" value="Update" />
            </form>
        </div>
    )
}
// 
export default PasswordResetComponent;