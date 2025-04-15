const { userCredentialModel } = require("../DB_Models/userCredentialModel.js");
const { userConversationModel } = require("../DB_Models/userConversationModel.js");
// Rearranging user Friend's Email ID to Top of the List
const rearrangeFriendsPosition = async(userID, FriendUserID) => {
    const getUserProfileDetails = JSON.parse(JSON.stringify((await userCredentialModel.findOne({ _id: userID }, { _id: 0, FriendsList: 1 })).FriendsList));
    const getFriendEmailID = (await userCredentialModel.findOne({ _id: FriendUserID }, { _id: 0, userEmail: 1 })).userEmail;
    getUserProfileDetails.splice(getUserProfileDetails.indexOf(getFriendEmailID), 1);
    getUserProfileDetails.unshift(getFriendEmailID);
    const updatedUser = await userCredentialModel.findOneAndUpdate({ _id: userID }, { $set: { FriendsList: getUserProfileDetails }});
    if(!updatedUser) throw new Error("Error!");
}
// fetching Message to user and Friend's DB Doc
const handleFetchMessage = async(MessageDetails) => {
    const { userID, FriendUserID, LastSeenDate, LastSeenTime, MessagePayload } = MessageDetails;
    // Updating and Inserting Message
    try {
        // updating and fetching Message to Sender(userID)
        const SenderFriendsList = JSON.parse(JSON.stringify((await userConversationModel.findOne({ userID }, { _id: 0, FriendsList: 1 })).FriendsList));
        SenderFriendsList.map((eachFriendDetails) => {
            if (eachFriendDetails.FriendUserID === FriendUserID) {
                eachFriendDetails.LastSeenDate = LastSeenDate;
                eachFriendDetails.LastSeenTime = LastSeenTime;
                if (!eachFriendDetails.AllMessages[LastSeenDate]) {
                    eachFriendDetails.AllMessages[LastSeenDate] = [`Sent--${MessagePayload}--${LastSeenTime}`];
                }
                else {
                    eachFriendDetails.AllMessages[LastSeenDate].push(`Sent--${MessagePayload}--${LastSeenTime}`);
                }
            }
        });
        // updating and fetching Message to Receiver according to userID
        const ReceiverFriendsList = JSON.parse(JSON.stringify((await userConversationModel.findOne({ userID: FriendUserID }, { _id: 0, FriendsList: 1 })).FriendsList));
        ReceiverFriendsList.map((eachFriendDetails) => {
            if (eachFriendDetails.FriendUserID === userID) {
                if (!eachFriendDetails.AllMessages[LastSeenDate]) {
                    eachFriendDetails.AllMessages[LastSeenDate] = [`Received--${MessagePayload}--${LastSeenTime}`];
                }
                else {
                    eachFriendDetails.AllMessages[LastSeenDate].push(`Received--${MessagePayload}--${LastSeenTime}`);
                }
            }
        });
        // updating sender and receiver db doc
        const updatedSender = await userConversationModel.findOneAndUpdate({ userID }, { $set: { FriendsList: SenderFriendsList }});
        const updatedReceiver = await userConversationModel.findOneAndUpdate({ userID: FriendUserID }, { $set : { FriendsList: ReceiverFriendsList }});
        // 
        if(updatedSender && updatedReceiver) {
            rearrangeFriendsPosition(userID, FriendUserID);
            return "Message fetched Successfully!";
        }
    } catch (error) {
        if(error) return "Error while updating Message to DB Doc!";
    }
}
// 
module.exports = { handleFetchMessage };