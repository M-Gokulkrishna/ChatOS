import './SplashScreen.css';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HoneyCombStyledComponent from '../../UtilityComponents/HoneyCombStyledComponent';
// 
const splashScreen = () => {
  const NavigateTo = useNavigate();
  const userSessionState = useSelector(state => state.userSessionState);
  // 
  useEffect(() => {
    if (userSessionState.userSessionStatus === "Access Granted!") {
      setTimeout(() => {
        NavigateTo("/DashBoard");
      }, 6000);
    }
    else if (userSessionState.userSessionStatus === "Access Denied!") {
      setTimeout(() => {
        NavigateTo("/AuthPage");
      }, 6000);
    }
  }, [userSessionState]);
  // 
  return (
    <div className='Splash-Screen-Page'>
      <ul>
        <li className='Splash-Screen-Bubbles' style={{ "--Bubble-Scale": "1.0", "--Bg-Color": "rgba(100, 70, 210, 0.7)", "--Animation-Delay": "0.5s * 1", "--Bubbles-OffsetX": "-120px", "--Bubbles-OffsetY": "-120px" }}></li>
        <li className='Splash-Screen-Bubbles' style={{ "--Bubble-Scale": "1.2", "--Bg-Color": "rgba(100, 70, 210, 0.6)", "--Animation-Delay": "0.5s * 3", "--Bubbles-OffsetX": "50%", "--Bubbles-OffsetY": "-120px" }}></li>
        <li className='Splash-Screen-Bubbles' style={{ "--Bubble-Scale": "1.4", "--Bg-Color": "rgba(100, 70, 210, 0.5)", "--Animation-Delay": "0.5s * 2", "--Bubbles-OffsetX": "100% + 120px", "--Bubbles-OffsetY": "-120px" }}></li>
        <li className='Splash-Screen-Bubbles' style={{ "--Bubble-Scale": "1.6", "--Bg-Color": "rgba(100, 70, 210, 0.4)", "--Animation-Delay": "0.5s * 4", "--Bubbles-OffsetX": "-120px", "--Bubbles-OffsetY": "100% + 120px" }}></li>
        <li className='Splash-Screen-Bubbles' style={{ "--Bubble-Scale": "1.8", "--Bg-Color": "rgba(100, 70, 210, 0.3)", "--Animation-Delay": "0.5s * 6", "--Bubbles-OffsetX": "50%", "--Bubbles-OffsetY": "100% + 120px" }}></li>
        <li className='Splash-Screen-Bubbles' style={{ "--Bubble-Scale": "2.0", "--Bg-Color": "rgba(100, 70, 210, 0.2)", "--Animation-Delay": "0.5s * 5", "--Bubbles-OffsetX": "100% + 120px", "--Bubbles-OffsetY": "100% + 120px" }}></li>
      </ul>
      <main>
        <b className='Site-Name'>
          <span>ChatOS</span>
        </b>
        <span className='Welcome-Greeting'>
          <h3>Welcome to ChatOS</h3>
          <p>by Gokul Krishna</p>
        </span>
      </main>
      <div className='SplashScreen-HoneyCombStyled-Component'>
        <HoneyCombStyledComponent />
      </div>
    </div>
  )
}
// 
export default splashScreen;