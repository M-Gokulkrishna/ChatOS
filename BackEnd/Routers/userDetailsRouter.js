const express = require('express');
const JWT = require('jsonwebtoken');
const { MulterError } = require('multer');
const userDetailsRouter = express.Router();
const { deleteFile } = require('../Utilities/deleteFile.js');
const { ProfileImageUpload } = require('../Middlewares/ImageUpload.js');
const { userCredentialModel } = require('../DB_Models/userCredentialModel.js');
const { userConversationModel } = require('../DB_Models/userConversationModel.js');
// Profile Image Upload
userDetailsRouter.post('/ImageUpload', async (request, response) => {
    ProfileImageUpload(request, response, async (err) => {
        if (err instanceof MulterError && err.code === "LIMIT_FILE_SIZE") {
            return response.status(400).json({ RequestStatus: "File Size must be less than 10mb!" });
        }
        else if (!request.file) {
            return response.status(400).json({ RequestStatus: "No file selected!" });
        }
        else if (!request.body?.userID) {
            return response.status(400).json({ RequestStatus: "Invalid userID to Image Upload!" });
        }
        const getUser = await userCredentialModel.findById({ _id: request.body?.userID });
        if (!getUser) {
            return response.status(400).json({ RequestStatus: "User Not Exist!" });
        }
        else {
            if (getUser.profileImageFile) {
                const fileDeleteResponse = deleteFile("ProfileImages", getUser.profileImageFile);
                if (fileDeleteResponse === "Error while Deleting File!") {
                    return response.status(400).json({ RequestStatus: "Error while Deleting File!" });
                }
            }
            await userCredentialModel.updateOne({ _id: request.body?.userID }, { $set: { profileImageFile: request.file?.filename } });
            return response.status(201).json(
                {
                    RequestStatus: "File Uploaded Successfully!",
                    FileName: request.file?.filename
                });
        }
    });
});
// unLink Profile Image
userDetailsRouter.post("/unLinkImage", async (request, response) => {
    const { userID } = request.body;
    // Validation
    if (!userID) return response.status(404).json({ RequestStatus: "Invalid userID format!" });
    // 
    try {
        const getUser = await userCredentialModel.findById({ _id: userID }).select("profileImageFile");
        if (!getUser) {
            return response.status(404).json({ RequestStatus: "User Not Exist!" });
        }
        const fileDeleteResponse = deleteFile("ProfileImages", getUser.profileImageFile);
        if (fileDeleteResponse === "Error while Deleting File!") {
            return response.status(400).json({ RequestStatus: "Error while Deleting File!" });
        }
        await userCredentialModel.updateOne({ _id: userID }, { $set: { profileImageFile: "" } });
        return response.status(200).json({ RequestStatus: "File Deleted Successfully!" });
    } catch (error) {
        if (error) {
            return response.status(400).json({ RequestStatus: "Error while Deleting File" })
        }
    }
});
// edit Profile Details
userDetailsRouter.post("/editProfileDetails", async (request, response) => {
    const { userID, profileName, profileDescription, FriendsList } = request.body;
    // Validation
    if (!userID) return response.status(400).json({ RequestStatus: "userID is Required!" });
    else if (!profileName) return response.status(400).json({ RequestStatus: "profileName is Required!" });
    // 
    try {
        if (!await userCredentialModel.findOne({ _id: userID })) {
            return response.status(404).json({ RequestStatus: "User Not Exist!" });
        }
        else {
            const updatedUser = await userCredentialModel.findOneAndUpdate({ _id: userID }, {
                $set: {
                    profileName,
                    profileDescription,
                    isProfileUpdated: true,
                    FriendsList
                }
            });
            const FriendsUserIDList = JSON.parse(JSON.stringify(await userCredentialModel.find({ userEmail: { $in: [...FriendsList] } }).select("_id")));
            const userConversationBucketList = FriendsUserIDList.map((eachFriendEmailID) => {
                return {
                    FriendUserID: eachFriendEmailID._id,
                    LastSeenDate: "",
                    LastSeenTime: "",
                    AllMessages: {}
                }
            });
            const UpdatedUserConversation = await userConversationModel.create({
                userID,
                FriendsList: userConversationBucketList
            });
            // 
            if (updatedUser && UpdatedUserConversation) {
                const Refesh_Token = JWT.sign({ userID, isProfileUpdated: true }, process.env.JWT_SECRET_KEY, { expiresIn: "3h" });
                response.cookie("_UAID", Refesh_Token, {
                    secure: false,
                    signed: true,
                    httpOnly: true,
                    maxAge: (1000 * 60 * 60 * 3)
                });
                return response.status(201).json(
                    {
                        RequestStatus: "ProfileDetials updated Successfully!",
                        userSessionData: {
                            userID: updatedUser._id,
                            isProfileUpdated: true
                        }
                    }
                );
            }
        }
    } catch (error) {
        if (error) {
            return response.status(400).json({ RequestStatus: "Error while updating profileDetails!" });
        }
    }
});
// update Profile Details
userDetailsRouter.post("/updateProfileDetails", async (request, response) => {
    const { userID, profileName, profileDescription } = request.body;
    // Validation
    if (!userID) return response.status(400).json({ RequestStatus: "Invalid UserID Format!" });
    else if (!profileName) return response.status(400).json({ RequestStatus: "profileName is Required!" });
    // 
    try {
        if (!await userCredentialModel.findOne({ _id: userID })) {
            return response.status(404).json({ RequestStatus: "User Not Exist!" });
        }
        else {
            await userCredentialModel.findOneAndUpdate({ _id: userID }, {
                profileName,
                profileDescription
            });
            return response.status(201).json({ RequestStatus: "Profile Details Updated Successfully!" });
        }
    } catch (error) {
        if (error) {
            return response.status(400).json({ RequestStatus: "Error while updating Profile Details!" })
        }
    }
});
// Add New Friends to the user's FriendsList
userDetailsRouter.post("/AddNewFriends", async (request, response) => {
    const { userID, FriendsList } = request.body;
    // Validation
    if (!userID) return response.status(400).json({ RequestStatus: "Invalid userID Format!" });
    // 
    try {
        if (!await userCredentialModel.findOne({ _id: userID })) {
            return response.status(404).json({ RequestStatus: "User Not Exist!" });
        }
        else {
            await userCredentialModel.findOneAndUpdate({ _id: userID }, { $push: { FriendsList: { $each: FriendsList } } });
            const FriendsUserIDList = JSON.parse(JSON.stringify(await userCredentialModel.find({ userEmail: { $in: [...FriendsList] } }).select("_id")));
            const userConversationBucketList = FriendsUserIDList.map((eachFriendEmailID) => {
                return {
                    FriendUserID: eachFriendEmailID._id,
                    LastSeenDate: "",
                    LastSeenTime: "",
                    AllMessages: {}
                }
            });
            await userConversationModel.findOneAndUpdate({ userID }, { $push: { FriendsList: { $each: [...userConversationBucketList] } } });
            return response.status(201).json({ RequestStatus: "New Friends Added Successfully!" });
        }
    } catch (error) {
        if (error) {
            return response.status(400).json({ RequestStatus: "Error while adding New Friends!" });
        }
    }
});
// get Profile Details
userDetailsRouter.post('/getUserProfileDetails', async (request, response) => {
    const { userID } = request.body;
    // Validation
    if (!userID) return response.status(400).json({ RequestStatus: "Invalid userID Format!" });
    // 
    try {
        const getUserProfileDetails = JSON.parse(JSON.stringify(await userCredentialModel.findById({ _id: userID }).select(["-_id", "profileName", "profileDescription", "profileImageFile", "FriendsList"])));
        if (!getUserProfileDetails) return response.status(404).json({ RequestStatus: "User Not Exist!" });
        const { FriendsList, ...privateDetails } = getUserProfileDetails;
        const UserFriendsProfileDetails = await Promise.all(FriendsList.map(async(eachFriend) => {
            return JSON.parse(JSON.stringify(await userCredentialModel.findOne({ userEmail: eachFriend }).select(["_id", "profileName", "profileDescription", "profileImageFile"])));
        }));
        const UserFriendsSessionDetails = JSON.parse(JSON.stringify((await userConversationModel.findOne({ userID }, { _id: 0, FriendsList: 1 })).FriendsList));
        const ResultantFriendsDetails = await Promise.all(UserFriendsProfileDetails.map(async(eachFriend) => {
            const getEachFriendSession = UserFriendsSessionDetails.find((eachFriendSession) => eachFriendSession.FriendUserID === eachFriend._id);
            return {
                ...eachFriend,
                LastSeenDate: getEachFriendSession.LastSeenDate,
                LastSeenTime: getEachFriendSession.LastSeenTime
            }
        }));
        return response.status(200).json({ RequestStatus: "userProfile details fetched Successfully!", userProfileDetails: JSON.stringify(privateDetails), userFriendsProfileDetails: JSON.stringify(ResultantFriendsDetails) });
    } catch (error) {
        if (error) {
            return response.status(400).json({ RequestStatus: "Error while fetching ProfileDetails!" });
        }
    }
});
// get Selected Friend Conversation
userDetailsRouter.post("/storedMessages", async (request, response) => {
    const { userID, FriendUserID } = request.body;
    // Validation
    if (!userID || !FriendUserID) return response.status(400).json({ RequestStatus: "userID and FriendUserID is Required!" });
    // 
    try {
        const getUserConversationDetail = JSON.parse(JSON.stringify(await userConversationModel.findOne(
            {
                userID,
                "FriendsList.FriendUserID": FriendUserID
            },
            {
                _id: 0,
                FriendsList: { $elemMatch: { FriendUserID } }
            }
        ))).FriendsList[0];
        return response.status(200).json(
            {
                RequestStatus: "Stored Message Fetched Successfully!",
                StoredMessages: {
                    LastSeenDate: getUserConversationDetail.LastSeenDate,
                    LastSeenTime: getUserConversationDetail.LastSeenTime,
                    AllMessages: getUserConversationDetail.AllMessages
                }
            });
    } catch (error) {
        if (error) {
            return response.status(400).json({ RequestStatus: "Error while get user Friend's Conversation!" });
        }
    }
});
// 
module.exports = { userDetailsRouter };