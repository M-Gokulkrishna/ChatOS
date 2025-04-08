import './AuthPage.css';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// EmailVerify InitialState
const EmailVerify_Initial_State = {
    userName: "",
    userEmail: "",
}
// 
const AuthPage = ({ PageWidth }) => {
    const NavigateTo = useNavigate();
    const routeLocation = useLocation();
    const [ToggleForm, setToggleForm] = useState(false);
    const userSessionState = useSelector(state => state.userSessionState);
    const [EmailVerifyDetails, setEmailVerifyDetails] = useState(EmailVerify_Initial_State);
    // 
    useEffect(() => {
        if (userSessionState.userSessionStatus === "Access Granted!") {
            if (userSessionState.userSessionData.userID && userSessionState.userSessionData.isProfileUpdated) {
                NavigateTo("/DashBoard");
            }
            else {
                NavigateTo("EditProfile");
            }
        }
    }, [userSessionState]);

    // 
    return (
        <div className='Auth-Page'>
            <div className="Auth-Container" style={(ToggleForm && PageWidth > 700) ? { transform: "translateX(100%)" } : { transform: "translateX(0%)" }}>
                <Outlet context={{ NavigateTo, EmailVerifyDetails, setEmailVerifyDetails }} />
            </div>
            <div className="Auth-Describe-Container" style={(ToggleForm && PageWidth > 700) ? { transform: "translateX(-100%)" } : { transform: "translateX(0%)" }}>
                {
                    (routeLocation.pathname.split("/")[2] !== "Signup") &&
                    <div className="Auth-Describer">
                        <h3>Welcome to ChatOS!</h3>
                        <p>Don't have an account?</p>
                        <button onClick={() => { NavigateTo("Signup"); setToggleForm(!ToggleForm) }}>Register</button>
                    </div>
                }
                {
                    (routeLocation.pathname.split("/")[2] === "Signup") &&
                    <div className="Auth-Describer">
                        <h3>Welcome to ChatOS!</h3>
                        <p>Already have an account?</p>
                        <button onClick={() => { NavigateTo("Login"); setToggleForm(!ToggleForm) }}>Login</button>
                    </div>
                }
            </div>
        </div>
    )
}
// 
export default AuthPage;