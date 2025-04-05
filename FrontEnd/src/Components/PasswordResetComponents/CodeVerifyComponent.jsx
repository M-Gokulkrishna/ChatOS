import axios from 'axios';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
// CodeVerify InitialState
const CodeVerify_Initial_State = {
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
    digit5: "",
    digit6: ""
}
// Component
const CodeVerifyComponent = () => {
    const CodeVerifyInputRef = useRef(null);
    const [InputAutoFocus, setInputAutoFocus] = useState(1);
    const [InputErrorResponse, setInputErrorResponse] = useState("");
    const [CodeVerifyDetails, setCodeVerifyDetails] = useState(CodeVerify_Initial_State);
    // Api Request for CodeVerify User
    const { mutate: fetchCodeVerify } = useMutation({
        mutationFn: async () => {
            const verificationCode = parseInt(Object.values(CodeVerifyDetails).join(""));
            const data = await axios.post("http://localhost:8080/api/auth/verifyCode", { verificationCode });
            return data;
        },
        onSuccess: (CodeVerifyResponse) => {
            if (CodeVerifyResponse?.data?.RequestStatus === "Code Verified Successfully!") {
                // 
            }
        },
        onError: (CodeVerifyErrorResponse) => {
            if (CodeVerifyErrorResponse?.response?.data?.RequestStatus) {
                setInputErrorResponse("CodeVerification-Input");
                toast.error(CodeVerifyErrorResponse?.response?.data?.RequestStatus);
            }
        }
    });
    // CodeVerifyForm Submission
    const handleCodeVerifySubmission = (e) => {
        e.preventDefault();
        // Validation
        if (Object.values(CodeVerifyDetails).join("").length < 6) {
            setInputErrorResponse("CodeVerification-Input");
            toast.warn("Invalid VerificationCode format!");
            return;
        }
        // form Submission, Calling CodeVerify Mutate function
        // fetchCodeVerify();
    }
    // handling CodeVerify Inputs
    function handleCodeVerifyInputs(e) {
        if (e.target.value !== "") {
            setInputAutoFocus(parseInt(e.target.name[String(e.target.name).length - 1]) + 1);
            setCodeVerifyDetails(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
        }
    }
    // set Focus to next Input Automatically!
    useEffect(() => {
        if (InputAutoFocus <= 6) {
            CodeVerifyInputRef.current.focus();
        }
        else {
            setInputAutoFocus(1);
        }
    }, [InputAutoFocus])
    // 
    return (
        <div className='CodeVerify-Container'>
            <form onSubmit={handleCodeVerifySubmission}>
                <input type="number" name="digit1" id="CodeVerification-Input" ref={(InputAutoFocus === 1) ? CodeVerifyInputRef : null} onChange={handleCodeVerifyInputs} style={(InputErrorResponse === "CodeVerification-Input") ? { border: "2.3px solid tomato" } : {}} autoFocus />
                <input type="number" name="digit2" id="CodeVerification-Input" ref={(InputAutoFocus === 2) ? CodeVerifyInputRef : null} onChange={handleCodeVerifyInputs} style={(InputErrorResponse === "CodeVerification-Input") ? { border: "2.3px solid tomato" } : {}} />
                <input type="number" name="digit3" id="CodeVerification-Input" ref={(InputAutoFocus === 3) ? CodeVerifyInputRef : null} onChange={handleCodeVerifyInputs} style={(InputErrorResponse === "CodeVerification-Input") ? { border: "2.3px solid tomato" } : {}} />
                <input type="number" name="digit4" id="CodeVerification-Input" ref={(InputAutoFocus === 4) ? CodeVerifyInputRef : null} onChange={handleCodeVerifyInputs} style={(InputErrorResponse === "CodeVerification-Input") ? { border: "2.3px solid tomato" } : {}} />
                <input type="number" name="digit5" id="CodeVerification-Input" ref={(InputAutoFocus === 5) ? CodeVerifyInputRef : null} onChange={handleCodeVerifyInputs} style={(InputErrorResponse === "CodeVerification-Input") ? { border: "2.3px solid tomato" } : {}} />
                <input type="number" name="digit6" id="CodeVerification-Input" ref={(InputAutoFocus === 6) ? CodeVerifyInputRef : null} onChange={handleCodeVerifyInputs} style={(InputErrorResponse === "CodeVerification-Input") ? { border: "2.3px solid tomato" } : {}} />
                <b>Enter Verification Code</b>
                <input type="submit" value="Verify" />
            </form>
        </div>
    )
}
// 
export default CodeVerifyComponent;