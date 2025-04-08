import './DashBoard.css';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Outlet, useNavigate } from 'react-router-dom';
import DefaultUserPic from '../../assets/Images/userProfileDefault.png';
import ProfilesComponent from '../../Components/ProfilesComponent/ProfilesComponent';
import HoneyCombStyledComponent from '../../UtilityComponents/HoneyCombStyledComponent';
import { FaAlignRight, FaCommentDots, FaHandshake, FaSearch, FaTimes } from 'react-icons/fa';
import ConversationComponent from '../../Components/ConversationComponent/ConversationComponent';
// 
const socketIO = io("http://localhost:4000", {
    autoConnect: false
});
// 
const DashBoard = ({ PageWidth, VerifyToken }) => {
    const NavigateTo = useNavigate();
    const [NavBarClick, setNavBarClick] = useState(false);
    const [SelectedProfile, setSelectedProfile] = useState({});
    const [FilteredProfiles, setFilteredProfiles] = useState({});
    const [userProfileDetails, setUserProfileDetails] = useState({});
    const [ConfirmationBoxState, setConfirmationBoxState] = useState({});
    const userSessionState = useSelector(state => state.userSessionState);
    const [userFriendsProfileDetails, setUserFriendsProfileDetails] = useState([]);
    // 
    useEffect(() => {
        if (userSessionState?.userSessionStatus === "Access Denied!") {
            if (ConfirmationBoxState.ConfirmationType === "NewAccount") {
                NavigateTo("/AuthPage/Signup");
                return;
            }
            NavigateTo("/AuthPage/Login");
        }
    }, [userSessionState]);
    // Api Request to get UserProfile Details
    const { mutate: getUserProfileDetails } = useMutation({
        mutationFn: async () => {
            const data = await axios.post("http://localhost:8080/api/userDetail/getUserProfileDetails", { userID: userSessionState.userSessionData.userID }, { withCredentials: true });
            return data;
        },
        onSuccess: (userProfileDetailsResponse) => {
            setUserProfileDetails(JSON.parse(userProfileDetailsResponse?.data?.userProfileDetails));
            setFilteredProfiles(JSON.parse(userProfileDetailsResponse?.data?.userFriendsProfileDetails));
            setUserFriendsProfileDetails(JSON.parse(userProfileDetailsResponse?.data?.userFriendsProfileDetails));
        },
        onError: (userProfileDetailsErrorResponse) => {
            if (userProfileDetailsErrorResponse?.response?.data?.RequestStatus) {
                toast.error(userProfileDetailsErrorResponse?.response?.data?.RequestStatus);
            }
        }
    });
    // getting user Profile Details
    useEffect(() => {
        if (userSessionState.userSessionData.userID) {
            getUserProfileDetails();
            socketIO.connect();
            socketIO.emit("connectSession", { userID: userSessionState.userSessionData.userID });
        }
    }, [userSessionState.userSessionData.userID]);
    // handling search Input to filter profiles
    function handleSearchInput(e) {
        setFilteredProfiles(
            userFriendsProfileDetails.filter((data) =>
                String(data.profileName).includes(e.target.value.toLowerCase())
            )
        );
    }
    // Logout user Session (or) handling re-direct to create NewAccount
    async function handleLogoutSession() {
        try {
            const LogoutResponse = await axios.get("http://localhost:8080/api/auth/logout", { withCredentials: true });
            if (LogoutResponse?.data?.RequestStatus === "Logout Successfully!") {
                VerifyToken();        
            }
        } catch (error) {
            if (error) {
                toast.error(error);
            }
        }
    }
    // 
    return (
        <div className="DashBoard-Page">
            <Outlet context={{ NavigateTo, getUserProfileDetails, setConfirmationBoxState, userProfileDetails }} />
            <div className='Home-Container' style={(SelectedProfile.chattingState && PageWidth <= 700) ? { zIndex: "1" } : { zIndex: "2" }}>
                <header>
                    <div className="Section1">
                        {
                            !userProfileDetails.profileImageFile &&
                            <img src={DefaultUserPic} alt="" />
                        }
                        {
                            userProfileDetails.profileImageFile &&
                            <img src={`http://localhost:8080/Uploads/ProfileImages/${userProfileDetails.profileImageFile}`} alt="" />
                        }
                        <h3>ChatOS</h3>
                        <span onClick={() => setNavBarClick(true)}>
                            <FaAlignRight />
                        </span>
                    </div>
                    <div className="Section2">
                        <div>
                            <span>
                                <FaSearch />
                            </span>
                            <input type="text" name='SearchInputValue' id='SearchInputValue' placeholder='' autoComplete='off' onChange={handleSearchInput} />
                            <label htmlFor="SearchInputValue">Search</label>
                        </div>
                    </div>
                </header>
                <nav style={(NavBarClick) ? { right: "0" } : { right: "-220px" }}>
                    <span onClick={() => setNavBarClick(false)}>
                        <FaTimes />
                    </span>
                    <div>
                        <b onClick={() => { NavigateTo("EditProfile"); setNavBarClick(false) }}>Profile</b>
                        <b onClick={() => { NavigateTo("UtilityToolSet"); setNavBarClick(false) }}>Utilities</b>
                        <b>Settings</b>
                        <b onClick={() => { setConfirmationBoxState({ ConfimationText: "Are you sure to Logout!", ConfirmationType: "Logout", Button1Text: "Ok", Button2Text: "Cancel" }); setNavBarClick(false); }}>Logout</b>
                    </div>
                </nav>
                <main>
                    <span onClick={() => NavigateTo("AddFriends")}>
                        <FaHandshake />
                    </span>
                    <ProfilesComponent FilteredProfiles={FilteredProfiles} setSelectedProfile={setSelectedProfile} />
                </main>
            </div>
            {
                SelectedProfile.chattingState &&
                <ConversationComponent socketIO={socketIO} PageWidth={PageWidth} NavigateTo={NavigateTo} SelectedProfile={SelectedProfile} setSelectedProfile={setSelectedProfile} />
            }
            {
                (!SelectedProfile.chattingState && PageWidth > 700) &&
                <div className="chatting-PlaceHolder">
                    <main>
                        <span>
                            <FaCommentDots />
                        </span>
                        <b>
                            <h3>Welcome to ChatOS &#129321;</h3>
                            <h5 style={{ marginRight: '10px' }}>Start the Conversation</h5>
                        </b>
                    </main>
                    <div className='HoneyComb-pattern-Container'>
                        <HoneyCombStyledComponent />
                    </div>
                </div>
            }
            {
                ConfirmationBoxState.ConfirmationType &&
                <div className='Confirmation-Container'>
                    <div>
                        <strong>{ConfirmationBoxState.ConfimationText}</strong>
                        <div>
                            <button style={{ backgroundColor: "tomato" }} onClick={handleLogoutSession}>{ConfirmationBoxState.Button1Text}</button>
                            <button style={{ backgroundColor: "royalblue" }} onClick={() => setConfirmationBoxState({})}>{ConfirmationBoxState.Button2Text}</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
// 
export default DashBoard;