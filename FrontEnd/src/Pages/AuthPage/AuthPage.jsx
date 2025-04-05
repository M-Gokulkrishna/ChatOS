import './AuthPage.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginComponent from '../../Components/SignupLoginComponents/LoginComponent.jsx';
import SignupComponent from '../../Components/SignupLoginComponents/SignupComponent.jsx';
import BeforeEditProfile from '../../Components/EditProfileComponent/BeforeEditProfile.jsx';
import CodeVerifyComponent from '../../Components/PasswordResetComponents/CodeVerifyComponent.jsx';
import EmailVerifyComponent from '../../Components/PasswordResetComponents/EmailVerifyComponent.jsx';
import PasswordResetComponent from '../../Components/PasswordResetComponents/PasswordResetComponent.jsx';
import { useSelector } from 'react-redux';
// 
const AuthPage = ({ PageWidth }) => {
    const NavigateTo = useNavigate();
    const [ChangeForm, setChangeForm] = useState(1);
    const [ToggleForm, setToggleForm] = useState(false);
    const userSessionState = useSelector(state => state.userSessionState);
    // 
    useEffect(() => {
        if (userSessionState.userSessionStatus === "Access Granted!") {
            if (userSessionState.userSessionData.userID && userSessionState.userSessionData.isProfileUpdated) {
                NavigateTo("/DashBoard");
            }
            else {
                setChangeForm(3);
            }
        }
    }, [userSessionState]);

    // 
    return (
        <div className='Auth-Page'>
            <div className="Auth-Container" style={(ToggleForm && PageWidth > 700) ? { transform: "translateX(100%)" } : { transform: "translateX(0%)" }}>
                {
                    ChangeForm === 1 &&
                    <LoginComponent setChangeForm={setChangeForm} NavigateTo={NavigateTo} />
                }
                {
                    ChangeForm === 2 &&
                    <SignupComponent setChangeForm={setChangeForm} />
                }
                {
                    ChangeForm === 3 &&
                    <BeforeEditProfile setChangeForm={setChangeForm} NavigateTo={NavigateTo} />
                }
                {
                    ChangeForm === 4 &&
                    <EmailVerifyComponent setChangeForm={setChangeForm} />
                }
                {
                    ChangeForm === 5 &&
                    <CodeVerifyComponent setChangeForm={setChangeForm} />
                }
                {
                    ChangeForm === 6 &&
                    <PasswordResetComponent setChangeForm={setChangeForm} />
                }
            </div>
            <div className="Auth-Describe-Container" style={(ToggleForm && PageWidth > 700) ? { transform: "translateX(-100%)" } : { transform: "translateX(0%)" }}>
                {
                    (ChangeForm === 1) &&
                    <div className="Auth-Describer">
                        <h3>Welcome to ChatOS!</h3>
                        <p>Don't have an account?</p>
                        <button onClick={() => { setChangeForm(2); setToggleForm(!ToggleForm) }}>Register</button>
                    </div>
                }
                {
                    (ChangeForm !== 1) &&
                    <div className="Auth-Describer">
                        <h3>Welcome to ChatOS!</h3>
                        <p>Already have an account?</p>
                        <button onClick={() => { setChangeForm(1); setToggleForm(!ToggleForm) }}>Login</button>
                    </div>
                }
            </div>
        </div>
    )
}
// 
export default AuthPage;