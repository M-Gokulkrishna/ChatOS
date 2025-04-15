const { userConversationModel } = require("../DB_Models/userConversationModel.js");
// Deleting Selected Message for User only (or) for All
const handleDeleteMessage = async (MessageDetails) => {
    const {userID, FriendUserID, DeleteType, MessageDate, MessagePayload} = MessageDetails;
    // Deleting Message for user Only
    if (DeleteType === "Delete for user") {
        try {
            const SenderFriendsList = JSON.parse(JSON.stringify((await userConversationModel.findOne({ userID }, { _id: 0, FriendsList: 1 })).FriendsList));
            SenderFriendsList.map((eachFriendDetails)=> {
                if(eachFriendDetails.FriendUserID === FriendUserID) {
                    const SelectedMessageIndex = eachFriendDetails.AllMessages[MessageDate].findIndex((eachMessage) => eachMessage === MessagePayload.join("--"));
                    if(SelectedMessageIndex >= 0) {
                        eachFriendDetails.AllMessages[MessageDate].splice(SelectedMessageIndex, 1);
                    }
                    if(eachFriendDetails.AllMessages[MessageDate].length === 0) {
                        delete eachFriendDetails.AllMessages[MessageDate];
                    }
                }
            });
            // Update modified Details
            const UpdatedSender = await userConversationModel.findOneAndUpdate({ userID }, { $set: { FriendsList: SenderFriendsList }});
            if(UpdatedSender) {
                return "Message Deleted Successfully for user!";
            }
        } catch (error) {
            if(error) return "Error while Deleting Message for User!";
        }
    }
    else if (DeleteType === "Delete for all") {
        try {
            const SenderFriendsList = JSON.parse(JSON.stringify((await userConversationModel.findOne({ userID }, { _id: 0, FriendsList: 1 })).FriendsList));
            SenderFriendsList.map((eachFriendDetails) => {
                if(eachFriendDetails.FriendUserID === FriendUserID) {
                    const SelectedMessageIndex = eachFriendDetails.AllMessages[MessageDate].findIndex((eachMessage) => eachMessage === MessagePayload.join("--"));
                    if(SelectedMessageIndex >= 0) {
                        eachFriendDetails.AllMessages[MessageDate].splice(SelectedMessageIndex, 1);
                    }
                    if(eachFriendDetails.AllMessages[MessageDate].length === 0) {
                        delete eachFriendDetails.AllMessages[MessageDate];
                    }
                }
            });
            const ReceiverFriendsList = JSON.parse(JSON.stringify((await userConversationModel.findOne({ userID: FriendUserID }, { _id: 0, FriendsList: 1})).FriendsList));
            ReceiverFriendsList.map((eachFriendDetails) => {
                if(eachFriendDetails.FriendUserID === userID) {
                    const SelectedMessageIndex = eachFriendDetails.AllMessages[MessageDate].findIndex((eachMessage) => eachMessage === `Received--${MessagePayload[1]}--${MessagePayload[2]}`);
                    if(SelectedMessageIndex >= 0) {
                        eachFriendDetails.AllMessages[MessageDate].splice(SelectedMessageIndex, 1);
                    }
                    if(eachFriendDetails.AllMessages[MessageDate].length === 0) {
                        delete eachFriendDetails.AllMessages[MessageDate];
                    }
                }
            });
            // updating Sender and Receiver modified Details
            const UpdatedSender = await userConversationModel.findOneAndUpdate({ userID }, { $set: { FriendsList: SenderFriendsList }});
            const UpdatedReceiver = await userConversationModel.findOneAndUpdate({ userID: FriendUserID }, { $set: { FriendsList: ReceiverFriendsList }});
            // 
            if(UpdatedSender && UpdatedReceiver) {
                return "Message Deleted Successfully for All!";
            }
        } catch (error) {
            if (error) return "Error while deleting Message for all";
        }
    }
}
// 
module.exports = { handleDeleteMessage };