import React from 'react';
import './ProfilesComponent.css';
import DefaultUserPic from '../../assets/Images/userProfileDefault.png';
// 
const ProfilesComponent = React.memo(({ FilteredProfiles: ProfilesList, setSelectedProfile }) => {
    // 
    function handleProfileClick(ProfileID) {
        const SelectedProfile = ProfilesList.find(eachProfile => eachProfile._id === ProfileID);
        setSelectedProfile({ chattingState: true, ...SelectedProfile });
    }
    return (
        <div className='Profiles-Container'>
            {
                ProfilesList[0] &&
                ProfilesList.map((eachProfile, index) => {
                    return <div className="profiles" key={index} onClick={() => handleProfileClick(eachProfile._id)}>
                        {
                            !eachProfile.profileImageFile &&
                            <img src={DefaultUserPic} alt="" />
                        }
                        {
                            eachProfile.profileImageFile &&
                            <img src={`http://localhost:8080/Uploads/ProfileImages/${eachProfile.profileImageFile}`} alt="" />
                        }
                        <b>
                            {eachProfile.profileName}
                            <p>Last Conversation at:&nbsp; 30-03-2025</p>
                        </b>
                    </div>
                })
            }
        </div>
    )
});
// 
export default ProfilesComponent;