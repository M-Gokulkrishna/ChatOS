const { userConversationModel } = require('../DB_Models/userConversationModel.js');
// 
const fetchMessage = async (MessageDetails) => {
    try {
        if (!await userConversationModel.findOne({ userID: MessageDetails.userID, "FriendsList.FriendUserID": MessageDetails.FriendUserID })) {
            throw new Error("User Not Exist!");
        }
        else {
            // fetchMessage to user DB Document
            const updatedUserConversation = await userConversationModel.findOneAndUpdate(
                {
                    userID: MessageDetails.userID,
                    "FriendsList.FriendUserID": MessageDetails.FriendUserID
                },
                {
                    $push: {
                        [`FriendsList.$[friendIDInfo].AllMessages.${MessageDetails.LastSeenDate}`]: `Sent--${MessageDetails.MessagePayload}--${MessageDetails.LastSeenTime}`
                    },
                    $set: {
                        "FriendsList.$[friendIDInfo].LastSeenDate": MessageDetails.LastSeenDate,
                        "FriendsList.$[friendIDInfo].LastSeenTime": MessageDetails.LastSeenTime
                    }
                },
                {
                    arrayFilters: [{ "friendIDInfo.FriendUserID": MessageDetails.FriendUserID }],
                    upsert: true
                }
            );
            // fetchMessage to Friend DB Document
            const updatedFriendConversation = await userConversationModel.findOneAndUpdate(
                {
                    userID: MessageDetails.FriendUserID,
                    "FriendsList.FriendUserID": MessageDetails.userID
                },
                {
                    $push: {
                        [`FriendsList.$[friendIDInfo].AllMessages.${MessageDetails.LastSeenDate}`]: `Received--${MessageDetails.MessagePayload}--${MessageDetails.LastSeenTime}`
                    },
                    $set: {
                        "FriendsList.$[friendIDInfo].LastSeenDate": MessageDetails.LastSeenDate,
                        "FriendsList.$[friendIDInfo].LastSeenTime": MessageDetails.LastSeenTime,
                    }
                },
                {
                    arrayFilters: [{ "friendIDInfo.FriendUserID": MessageDetails.userID }],
                    upsert: true
                }
            );
            if (updatedUserConversation && updatedFriendConversation) {
                return "Message fetched Successfully!";
            }
        }
    } catch (error) {
        if (error) {
            return `Error while fetch Message: ${error}!`;
        }
    }
}
// 
module.exports = { fetchMessage };