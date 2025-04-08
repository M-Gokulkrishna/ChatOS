import axios from 'axios';
import './BeforeEditProfile.css';
import { toast } from 'react-toastify';
import React, { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DefaultUser from '../../assets/Images/userProfileDefault.png';
import { FaBook, FaPlus, FaTimes, FaTrash, FaUpload, FaUser } from 'react-icons/fa';
import { setUserSessionState, setUserSessionStatus } from '../../ReduxUtilities/userSessionSlice';
// 
const EmailRegex = /^[\w.%+-]{4,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
// 
const InitialProfileDetails = {
    profileName: "",
    profileDescription: ""
}
// 
const BeforeEditProfile = () => {
    const AddFriendsInputRef = useRef();
    const { NavigateTo } = useOutletContext();
    const dispatchUserSessionState = useDispatch();
    const [UploadedFileName, setUploadedFileName] = useState("");
    const [FriendsEmailIDList, setFriendEmailIDList] = useState([]);
    const userSessionData = useSelector(state => state.userSessionState.userSessionData);
    const [userProfileDetails, setUserProfileDetails] = useState({ ...InitialProfileDetails });
    // Adding New Friend's UserEmailID to the Friends List
    const handleAddFriendInput = () => {
        const FriendEmailID = AddFriendsInputRef.current.value;
        AddFriendsInputRef.current.value = "";
        if (!EmailRegex.test(FriendEmailID)) {
            toast.warn("Invalid Friend Email ID!");
            return;
        }
        if (!FriendsEmailIDList.includes(FriendEmailID)) {
            setFriendEmailIDList(prevData => [...prevData, FriendEmailID]);
        }
    }
    // remove Invalid / Incorrect friend's EmailID from List
    function handleRemoveFriend(FriendIndex) {
        const DuplicateFriendsList = [...FriendsEmailIDList];
        DuplicateFriendsList.splice(FriendIndex, 1);
        setFriendEmailIDList(DuplicateFriendsList);
    }
    // handling profile Image upload
    async function handleImageFileUpload(e) {
        const formData = new FormData();
        formData.append("ProfileImage", e.target.files[0]);
        formData.append("userID", userSessionData.userID);
        // api request for Image Upload
        try {
            const FileUploadResponse = await axios.post('http://localhost:8080/api/userDetail/ImageUpload', formData, {
                withCredentials: true
            });
            if (FileUploadResponse.data?.RequestStatus === "File Uploaded Successfully!") {
                setUploadedFileName(FileUploadResponse.data?.FileName);
            }
        } catch (error) {
            if (error) toast.error(error);
        }
    }
    // handle delete ProfileImage
    async function handleUnlinkImage() {
        try {
            const ImageFileUnlinkResponse = await axios.post('http://localhost:8080/api/userDetail/unLinkImage', { userID: userSessionData.userID }, { withCredentials: true });
            if (ImageFileUnlinkResponse.data?.RequestStatus === "File Deleted Successfully!") {
                setUploadedFileName("");
            }
        } catch (error) {
            if (error) toast.error(error);
        }
    }
    // 
    // Api Request for fetch Profile Details
    const { mutate: fetchProfileDetails } = useMutation({
        mutationFn: async () => {
            const data = await axios.post("http://localhost:8080/api/userDetail/editProfileDetails", { userID: userSessionData.userID, ...userProfileDetails, FriendsList: FriendsEmailIDList }, { withCredentials: true });
            return data;
        },
        onSuccess: (ProfileDetailsResponse) => {
            if (ProfileDetailsResponse?.data?.RequestStatus === "ProfileDetials updated Successfully!") {
                NavigateTo("/DashBoard");
                dispatchUserSessionState(setUserSessionStatus("Access Granted!"));
                dispatchUserSessionState(setUserSessionState({ ...ProfileDetailsResponse?.data?.userSessionData }));
            }
        },
        onError: (ProfileDetailsErrorResponse) => {
            if (ProfileDetailsErrorResponse?.response?.data?.RequestStatus) {
                dispatchUserSessionState(setUserSessionStatus("Access Denied!"));
                toast.error(ProfileDetailsErrorResponse?.response?.data?.RequestStatus);
            }
        }
    });
    // handling profileDetails Inputs
    function handleUserProfileDetailsInputs(e) {
        setUserProfileDetails(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
    }
    // ProfileDetails form Submission
    function handleProfileFormSubmit(e) {
        e.preventDefault();
        // Validation
        if (!userProfileDetails.profileName) {
            toast.warn("ProfileName is Required!");
            return;
        }
        // Calling ProfileDetails mutate function
        fetchProfileDetails();
    }
    // 
    return (
        <form className='Before-Edit-Profile-Container'>
            <div className="Auth-Head">
                <h3>Edit Profile</h3>
            </div>
            <div className="section1">
                {
                    !UploadedFileName &&
                    <img src={DefaultUser} alt="#" />
                }
                {
                    UploadedFileName &&
                    <img src={`http://localhost:8080/Uploads/ProfileImages/${UploadedFileName}`} alt="#" />
                }
                <div className="profile-Image-uploader">
                    {
                        !UploadedFileName &&
                        <b>Upload File</b>
                    }
                    {
                        UploadedFileName &&
                        <strong>{UploadedFileName}</strong>
                    }
                    {
                        UploadedFileName &&
                        <span id='Cancel-Image-File' onClick={handleUnlinkImage}>
                            <FaTimes />
                        </span>
                    }
                    <label htmlFor="ProfileImage">
                        <FaUpload />
                        <input type="file" name="ProfileImage" id="ProfileImage" style={{ display: "none" }} accept='.jpg, .png, .jpeg' onChange={handleImageFileUpload} />
                    </label>
                </div>
            </div>
            <div className="section2">
                <b>The ProfileName is Visible to your Friends</b>
                <span>
                    <b>
                        <FaUser />
                    </b>
                    <input type="text" name="profileName" id="profileName" placeholder='' onChange={handleUserProfileDetailsInputs} />
                    <label htmlFor="profileName">Enter ProfileName</label>
                </span>
                <b>About</b>
                <span>
                    <b>
                        <FaBook />
                    </b>
                    <textarea name="profileDescription" id="profileDescription" placeholder='' onChange={handleUserProfileDetailsInputs}></textarea>
                    <label htmlFor="profileDescription">ProfileDescription</label>
                </span>
            </div>
            <div className="section3">
                <header>
                    <b>
                        <FaUser />
                    </b>
                    <input type="text" ref={AddFriendsInputRef} name='AddFriendInput' id='AddFriendInput' placeholder='' />
                    <label htmlFor="AddFriendInput">Friends List</label>
                    <span onClick={handleAddFriendInput}>
                        <FaPlus />
                    </span>
                </header>
                <ul>
                    {
                        !FriendsEmailIDList[0] &&
                        <span className='AddFriend-PlaceHolder'>
                            {"Eg: abc123@gmail.com"}
                        </span>
                    }
                    {
                        FriendsEmailIDList.map((eachFriendEmailID, index) => (
                            <li key={index}>
                                {eachFriendEmailID}
                                <b onClick={() => handleRemoveFriend(index)}>
                                    <FaTrash />
                                </b>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <button type="submit" onClick={handleProfileFormSubmit}>Submit</button>
        </form>
    )
}
// 
export default BeforeEditProfile;