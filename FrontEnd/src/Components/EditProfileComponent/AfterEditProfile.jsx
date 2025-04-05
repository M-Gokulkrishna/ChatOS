import axios from 'axios';
import './AfterEditProfile.css';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { FaBook, FaEdit, FaTimes, FaUser } from 'react-icons/fa';
import DefaultUserPic from '../../assets/Images/userProfileDefault.png';
import HoneyCombStyledComponent from '../../UtilityComponents/HoneyCombStyledComponent';
// 
const AfterEditProfile = ({ setEditProfileTabClick, setConfirmationBoxState, getUserProfileDetails, userProfileDetails }) => {
    const userSessionState = useSelector(state => state.userSessionState);
    const [ImageFileUploaderState, setImageFileUploaderState] = useState(false);
    const [ProfileDetailState, setProfileDetailState] = useState(
        {
            profileName: userProfileDetails.profileName,
            profileDescription: userProfileDetails.profileDescription
        }
    );
    // Api Request to Profile Image Upload
    async function handleProfileImageUpload(e) {
        const formData = new FormData();
        formData.append("ProfileImage", e.target.files[0]);
        formData.append("userID", userSessionState.userSessionData.userID);
        // 
        try {
            const ProfileImageUploadResponse = await axios.post("http://localhost:8080/api/userDetail/ImageUpload", formData, { withCredentials: true });
            if (ProfileImageUploadResponse?.data?.RequestStatus === "File Uploaded Successfully!") {
                getUserProfileDetails();
                setImageFileUploaderState(false);
            }
        } catch (error) {
            if (error) toast.error(error);
        }
    }
    // Api Request to Delete current ProfileImage
    async function handleUnlinkImage() {
        try {
            const ImageDeleteResponse = await axios.post("http://localhost:8080/api/userDetail/unLinkImage", { userID: userSessionState.userSessionData.userID }, { withCredentials: true });
            if (ImageDeleteResponse?.data?.RequestStatus === "File Deleted Successfully!") {
                getUserProfileDetails();
                setImageFileUploaderState(false);
            }
        } catch (error) {
            if (error) toast.error(error);
        }
    }
    // handle ProfileDetails Inputs
    function handleProfileDetailInputs(e) {
        setProfileDetailState(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
    }
    // Api Request to Submit ProfileDetails
    const { mutate: fetchUpdateProfileDetails } = useMutation({
        mutationFn: async () => {
            const data = await axios.post("http://localhost:8080/api/userDetail/updateProfileDetails", { userID: userSessionState.userSessionData.userID, ...ProfileDetailState }, { withCredentials: true });
            return data;
        },
        onSuccess: (ProfileDetailsUpdateResponse) => {
            if (ProfileDetailsUpdateResponse?.data?.RequestStatus === "Profile Details Updated Successfully!") {
                getUserProfileDetails();
                setEditProfileTabClick(false);
            }
        },
        onError: (ProfileDetailsUpdateErrorResponse) => {
            if (ProfileDetailsUpdateErrorResponse?.response?.data?.RequestStatus) {
                toast.error(ProfileDetailsUpdateErrorResponse?.response?.data?.RequestStatus);
            }
        }
    })
    // handle ProfileDetails Form
    function handleUpdateProfileDetailForm(e) {
        e.preventDefault();
        // Validation
        if (!ProfileDetailState.profileName) {
            toast.warn("ProfileName is Required!");
            return;
        }
        // Calling Profile Details mutate function
        fetchUpdateProfileDetails();
    }
    // 
    return (
        <div className='AfterEdit-Profile-Container'>
            <section>
                <span onClick={() => setEditProfileTabClick(false)}>
                    <FaTimes />
                </span>
                <div>
                    <u onClick={() => setImageFileUploaderState(true)}>
                        <FaEdit />
                    </u>
                    {
                        !userProfileDetails.profileImageFile &&
                        <img src={DefaultUserPic} alt="#" />
                    }
                    {
                        userProfileDetails.profileImageFile &&
                        <img src={`http://localhost:8080/Uploads/ProfileImages/${userProfileDetails.profileImageFile}`} alt="#" />
                    }
                </div>
            </section>
            <section>
                <form onSubmit={handleUpdateProfileDetailForm}>
                    <div>
                        <span>
                            <FaUser />
                        </span>
                        <input type="text" name="profileName" id="profileName" placeholder='' autoComplete='off' defaultValue={userProfileDetails.profileName} onChange={handleProfileDetailInputs} />
                        <label htmlFor="profileName">ProfileName</label>
                    </div>
                    <div>
                        <span>
                            <FaBook />
                        </span>
                        <textarea name="profileDescription" id="profileDescription" placeholder='' defaultValue={userProfileDetails.profileDescription} onChange={handleProfileDetailInputs}></textarea>
                        <label htmlFor="profileDescription">ProfileDescription</label>
                    </div>
                    <footer>
                        <div>
                            <div style={{ backgroundColor: "tomato" }} onClick={() => setConfirmationBoxState({ ConfimationText: "Are you sure to Logout!", ConfirmationType: "Logout", Button1Text: "Ok", Button2Text: "Cancel" })}>Logout</div>
                            <div style={{ backgroundColor: "royalblue" }} onClick={() => setConfirmationBoxState({ ConfimationText: "Are you sure to create a New account!", ConfirmationType: "NewAccount", Button1Text: "Continue", Button2Text: "Cancel" })}>New Account</div>
                        </div>
                        <button type="submit" id='ProfileUpdateBtn'>Save</button>
                    </footer>
                </form>
            </section>
            <HoneyCombStyledComponent />
            {
                ImageFileUploaderState &&
                <div className="ImageUploaderConfimationBox">
                    <b>Edit Profile Image</b>
                    <div>
                        <input type="file" name='ImageFileUploader' id='ImageFileUploader' accept='.jpg, .png, .jpeg' style={{ display: "none" }} onChange={handleProfileImageUpload} />
                        <label htmlFor="ImageFileUploader">Change</label>
                        <button onClick={() => { setImageFileUploaderState(false); handleUnlinkImage(); }}>Remove</button>
                    </div>
                </div>
            }
        </div>
    )
}
// 
export default AfterEditProfile;