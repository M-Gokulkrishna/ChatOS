const { userConversationModel } = require("../DB_Models/userConversationModel");
// 
const deleteMessage = async (MessageDetails) => {
    // 
    try {
        if (!await userConversationModel.findOne({ userID: MessageDetails.userID, "FriendsList.FriendUserID": MessageDetails.FriendUserID })) {
            throw new Error("User Not Exist!");
        }
        else {
            if (MessageDetails.DeleteType === "Delete for user") {
                const updatedUserConversation = await userConversationModel.findOneAndUpdate(
                    {
                        userID: MessageDetails.userID,
                        "FriendsList.FriendUserID": MessageDetails.FriendUserID
                    },
                    {
                        $pullAll: {
                            [`FriendsList.$[friendIDInfo].AllMessages.${MessageDetails.MessageDate}`]: [`Sent--${MessageDetails.MessagePayload}`, `Received--${MessageDetails.MessagePayload}`]
                        }
                    },
                    {
                        arrayFilters: [{ "friendIDInfo.FriendUserID": MessageDetails.FriendUserID }]
                    }
                );
                if (updatedUserConversation) {
                    return "Message Deleted Successfully for user!";
                }
            }
            else if (MessageDetails.DeleteType === "Delete for all") {
                const updatedUserConversation = await userConversationModel.findOneAndUpdate(
                    {
                        userID: MessageDetails.userID,
                        "FriendsList.FriendUserID": MessageDetails.FriendUserID
                    },
                    {
                        $pull: {
                            [`FriendsList.$[friendIDInfo].AllMessages.${MessageDetails.MessageDate}`]: `Sent--${MessageDetails.MessagePayload}`
                        }
                    },
                    {
                        arrayFilters: [{ "friendIDInfo.FriendUserID": MessageDetails.FriendUserID }]
                    }
                );
                const updatedFriendConversation = await userConversationModel.findOneAndUpdate(
                    {
                        userID: MessageDetails.FriendUserID,
                        "FriendsList.FriendUserID": MessageDetails.userID
                    },
                    {
                        $pull: {
                            [`FriendsList.$[friendIDInfo].AllMessages.${MessageDetails.MessageDate}`]: `Received--${MessageDetails.MessagePayload}`
                        }
                    },
                    {
                        arrayFilters: [{ "friendIDInfo.FriendUserID": MessageDetails.userID }]
                    }
                );
                if (updatedUserConversation && updatedFriendConversation) {
                    return "Message Deleted Successfully for All!";
                }
            }
        }
    } catch (error) {
        if (error) {
            return `Error while deleting Message: ${error}`;
        }
    }
}
// 
module.exports = { deleteMessage };