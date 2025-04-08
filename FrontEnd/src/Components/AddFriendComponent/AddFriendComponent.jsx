import axios from 'axios';
import './AddFriendComponent.css';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import React, { useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaPlus, FaSearch, FaTimes, FaTrash } from 'react-icons/fa';
import HoneyCombStyledComponent from '../../UtilityComponents/HoneyCombStyledComponent';
// 
const EmailRegex = /^[\w.%+-]{4,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
// 
const AddFriendComponent = () => {
    const FriendEmailIDRef = useRef();
    const [FriendsList, setFriendsList] = useState([]);
    const { NavigateTo, getUserProfileDetails } = useOutletContext();
    const userSessionState = useSelector(state => state.userSessionState.userSessionData);
    // Add New Friend's Email-ID to FriendsList
    function handleAddFriendEmailID() {
        const FriendEmailID = FriendEmailIDRef.current.value;
        FriendEmailIDRef.current.value = "";
        if (!EmailRegex.test(FriendEmailID)) {
            toast.warn("Invalid Email Format!");
            return;
        }
        if (!FriendsList.includes(FriendEmailID)) {
            setFriendsList(prevData => [...prevData, FriendEmailID]);
        }
    }
    // Remove Friend's Email-ID from FriendsList
    function handleRemoveFriendID(whichIndex) {
        const DuplicateFriendsList = FriendsList;
        DuplicateFriendsList.splice(whichIndex, 1);
        setFriendsList([...DuplicateFriendsList]);
    }
    // handle new Friends Adding
    async function handleAddNewFriends() {
        // Validation
        if (!FriendsList[0]) {
            toast.warn("Add few Friends before update!");
            return;
        }
        // 
        try {
            const AddFriendsResponse = await axios.post("http://localhost:8080/api/userDetail/AddNewFriends", { userID: userSessionState.userID, FriendsList }, { withCredentials: true });
            if (AddFriendsResponse?.data?.RequestStatus === "New Friends Added Successfully!") {
                getUserProfileDetails();
                NavigateTo("/DashBoard");
            }
        } catch (error) {
            if (error) {
                toast.error(error);
            }
        }
    }
    // 
    return (
        <div className='AddFriend-Container'>
            <header>
                <span onClick={() => NavigateTo("/DashBoard")}>
                    <FaTimes />
                </span>
                <div>
                    <b>
                        <FaSearch />
                    </b>
                    <input type="text" name='AddFriendInput' id='AddFriendInput' ref={FriendEmailIDRef} placeholder='' />
                    <label htmlFor="AddFriendInput">Enter EmailID</label>
                </div>
                <button onClick={handleAddFriendEmailID}>
                    <FaPlus />
                </button>
            </header>
            <main>
                {
                    !FriendsList[0] &&
                    <strong>Eg: abc123@gmail.com</strong>
                }
                {
                    FriendsList[0] &&
                    <div className="FriendsList-Container">
                        {
                            FriendsList.map((eachItem, index) => (
                                <b key={index}>
                                    <p>{eachItem}</p>
                                    <span onClick={() => handleRemoveFriendID(index)}>
                                        <FaTrash />
                                    </span>
                                </b>
                            ))
                        }
                    </div>
                }
            </main>
            <button className='AddFriends-Update-Btn' onClick={handleAddNewFriends}>Update</button>
            <HoneyCombStyledComponent />
        </div>
    )
}

export default AddFriendComponent