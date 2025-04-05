const { Schema, model } = require('mongoose');
// setup userConversationSchema
const userConversationSchema = new Schema({
    userID: {
        type: String,
        unique: true,
        required: true
    },
    FriendsList: [
        {
            FriendUserID: { type: String, required: true },
            LastSeenDate: { type: String, default: "" },
            LastSeenTime: { type: String, default: "" },
            AllMessages: {
                type: Map,
                of: Array
            }
        }
    ]
});
// config userConversationSchema Model
const userConversationModel = model("userConversationModel", userConversationSchema, "userConversation");
// 
module.exports = { userConversationModel };