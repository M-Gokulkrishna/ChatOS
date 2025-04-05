const { Schema, model } = require('mongoose');
// UserCredentialSchema
const UserCredentialSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    profileName: {
        type: String,
        required: true
    },
    profileImageFile: {
        type: String,
        default: ""
    },
    profileDescription: {
        type: String,
        default: ""
    },
    isProfileUpdated: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: Number,
        default: 0
    },
    FriendsList: [
        {
            type: String
        }
    ]
});
// config userCredential Model
const userCredentialModel = model("userCredentialModel", UserCredentialSchema, "userCredential");
// 
module.exports = { userCredentialModel };