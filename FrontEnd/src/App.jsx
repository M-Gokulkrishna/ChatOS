import './App.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import AuthPage from './Pages/AuthPage/AuthPage.jsx';
import { toast, ToastContainer } from 'react-toastify';
import DashBoard from './Pages/DashBoard/DashBoard.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from './Pages/SplashScreen/SplashScreen.jsx';
import UtilityNavbar from './UtilityComponents/UtilityToolSet/UtilityToolSet.jsx';
import LoginComponent from './Components/SignupLoginComponents/LoginComponent.jsx';
import SignupComponent from './Components/SignupLoginComponents/SignupComponent.jsx';
import AfterEditProfile from './Components/EditProfileComponent/AfterEditProfile.jsx';
import BeforeEditProfile from './Components/EditProfileComponent/BeforeEditProfile.jsx';
import AddFriendComponent from './Components/AddFriendComponent/AddFriendComponent.jsx';
import CodeVerifyComponent from './Components/PasswordResetComponents/CodeVerifyComponent.jsx';
import EmailVerifyComponent from './Components/PasswordResetComponents/EmailVerifyComponent.jsx';
import { setUserSessionStatus, setUserSessionState } from './ReduxUtilities/userSessionSlice.js';
import PasswordResetComponent from './Components/PasswordResetComponents/PasswordResetComponent.jsx';
// Component
const App = () => {
	const dispatchUserSessionState = useDispatch();
	const [PageWidth, setPageWidth] = useState(window.innerWidth);
	// Track PageWidth
	useEffect(() => {
		window.addEventListener("resize", () => {
			setPageWidth(window.innerWidth);
		});
	}, [PageWidth]);
	// Api Request for Email Verification
	const { mutate: VerifyToken } = useMutation({
		mutationFn: async () => {
			const data = await axios.get("http://localhost:8080/api/auth/verifyToken", { withCredentials: true });
			return data;
		},
		onSuccess: (SessionVerificationResponse) => {
			if (SessionVerificationResponse?.data?.RequestStatus === "Token Verified Successfully!") {
				dispatchUserSessionState(setUserSessionStatus("Access Granted!"));
				dispatchUserSessionState(setUserSessionState({ ...SessionVerificationResponse?.data?.Token_Data }));
			}
		},
		onError: (SessionVerificationErrorResponse) => {
			if (SessionVerificationErrorResponse?.response?.data?.RequestStatus) {
				dispatchUserSessionState(setUserSessionStatus("Access Denied!"));
				setTimeout(() => {
					toast.error(SessionVerificationErrorResponse?.response?.data?.RequestStatus);
				}, 2000);
			}
		}
	});
	//
	useEffect(() => {
		VerifyToken();
	}, []);
	// 
	return (
		<div className='App'>
			{
				<div style={{ position: "absolute", zIndex: 1000 }}>
					<ToastContainer position='top-center' autoClose="1500" draggable />
				</div>
			}
			<BrowserRouter>
				<Routes>
					<Route index element={<SplashScreen />} />
					<Route path='/AuthPage' element={<AuthPage PageWidth={PageWidth}/>}>
						<Route path='Login' element={<LoginComponent />}/>
						<Route path='Signup' element={<SignupComponent />}/>
						<Route path='EditProfile' element={<BeforeEditProfile />}/>
						<Route path='VerifyEmail' element={<EmailVerifyComponent />}/>
						<Route path='VerifyCode' element={<CodeVerifyComponent />}/>
						<Route path='PasswordReset' element={<PasswordResetComponent />}/>
					</Route>
					<Route path='/DashBoard' element={<DashBoard PageWidth={PageWidth} VerifyToken={VerifyToken} />}>
						<Route path='AddFriends' element={<AddFriendComponent />} />
						<Route path='EditProfile' element={<AfterEditProfile />} />
						<Route path='UtilityToolSet' element={<UtilityNavbar />} />
					</Route>
					<Route path='/DashBoard' element={<DashBoard PageWidth={PageWidth} VerifyToken={VerifyToken} />} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}
// 
export default App;