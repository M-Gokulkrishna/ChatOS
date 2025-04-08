const express = require('express');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const userAuthRouter = express.Router();
const { verifyToken } = require('../Middlewares/verifyToken');
const { mailTransporter } = require('../Utilities/mailTransporter');
const { getVerificationCode } = require('../Utilities/verificationCode');
const { userCredentialModel } = require('../DB_Models/userCredentialModel');
require('dotenv').config();
// Email and Password Regex
const EmailRegex = /^[\w.%+-]{4,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PassWordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
// Routes
// Register New User
userAuthRouter.post('/register', async (request, response) => {
    const { userName, userEmail, userPassword } = request.body;
    // Validation
    if (!userName) return response.status(400).json({ RequestStatus: "userName is Required!" });
    else if (!userEmail) return response.status(400).json({ RequestStatus: "userEmail is Required!" });
    else if (!userPassword) return response.status(400).json({ RequestStatus: "userPassword is Required!" });
    else if (!EmailRegex.test(userEmail)) return response.status(400).json({ RequestStatus: "Invalid userEmail format!" });
    else if (!PassWordRegex.test(userPassword)) return response.status(400).json({ RequestStatus: "Invalid userPassword format!" });
    // 
    try {
        if (!await userCredentialModel.findOne({ userName, userEmail })) {
            const HashedPassword = await bcrypt.hash(userPassword, 10);
            const CreatedUser = await userCredentialModel.create({
                userName,
                userEmail,
                userPassword: HashedPassword,
                profileName: userName
            });
            // 
            if (CreatedUser._id) {
                const JWT_TOKEN = JWT.sign({ userID: CreatedUser._id, isProfileUpdated: CreatedUser.isProfileUpdated }, process.env.JWT_SECRET_KEY, { expiresIn: "2h" });
                response.cookie("_UAID", JWT_TOKEN, {
                    secure: false,
                    signed: true,
                    httpOnly: true,
                    maxAge: (1000 * 60 * 60 * 3)
                });
                return response.status(201).json(
                    {
                        RequestStatus: "Account Created!",
                        userSessionData: {
                            userID: CreatedUser._id,
                            isProfileUpdated: false
                        }
                    }
                );
            }
        }
        else {
            return response.status(400).json({ RequestStatus: "User Already Exist!" });
        }
    } catch (error) {
        if (error) {
            return response.status(400).json({ RequestStatus: "Error while Registering User!" });
        }
    }
});
// Login with existing user
userAuthRouter.post("/login", async (request, response) => {
    const { userEmail, userPassword } = request.body;
    // Validation
    if (!userEmail) return response.status(400).json({ RequestStatus: "UserEmail is Required!" });
    else if (!userPassword) return response.status(400).json({ RequestStatus: "UserPassowrd is Required!" });
    else if (!EmailRegex.test(userEmail)) return response.status(400).json({ RequestStatus: "Invalid userEmail Format!" });
    else if (!PassWordRegex.test(userPassword)) return response.status(400).json({ RequestStatus: "Invalid userPassword Format!" });
    // 
    try {
        const getUser = await userCredentialModel.findOne({ userEmail });
        if (!getUser) {
            return response.status(404).json({ RequestStatus: "User Not Exist!" });
        }
        if (!await bcrypt.compare(userPassword, getUser.userPassword)) {
            return response.status(400).json({ RequestStatus: "Incorrect Password!" });
        }
        else {
            const JWT_TOKEN = JWT.sign({ userID: getUser._id, isProfileUpdated: getUser.isProfileUpdated }, process.env.JWT_SECRET_KEY, { expiresIn: "3h" });
            response.cookie("_UAID", JWT_TOKEN, {
                secure: false,
                signed: true,
                httpOnly: true,
                maxAge: (1000 * 60 * 60 * 3)
            });
            return response.status(200).json(
                {
                    RequestStatus: "Login Successfully!",
                    userSessionData: {
                        userID: getUser._id,
                        isProfileUpdated: true
                    }
                }
            );
        }
    } catch (error) {
        if (error) {
            return response.status(400).json({ RequestStatus: "Error while Login User!" });
        }
    }
});
// Verify userEmail for Password Resetting
userAuthRouter.post("/verifyEmail", async (request, response) => {
    const { userName, userEmail } = request.body;
    // Validation
    if (!userName) return response.status(400).json({ RequestStatus: "userName is Required!" });
    else if (!userEmail) return response.status(400).json({ RequestStatus: "userEmail is Required!" });
    else if (!EmailRegex.test(userEmail)) return response.status(400).json({ RequestStatus: "Invalid userEmail Format!" });
    // 
    try {
        if (!await userCredentialModel.findOne({ userName, userEmail })) {
            return response.status(404).json({ RequestStatus: "User Not Exist!" });
        }
        else {
            const VerificationCode = await getVerificationCode(userEmail);
            if (VerificationCode === "Error while fetching verification code to DB!") {
                throw new Error("Error while fetching verification code to DB!");
            }
            else {
                const mailDetails = {
                    from: process.env.NODEMAILER_SERVICE_EMAIL,
                    to: userEmail,
                    subject: "Verification code for Password Reset! (ChatOS)",
                    text: `Your Verification code for resetting Password\n(Verification Code expires after 2 minutes)\n\nCode: ${VerificationCode}`
                }
                mailTransporter.sendMail(mailDetails, (mailError) => {
                    if (mailError) return response.status(400).json({ RequestStatus: "Error while Sending Email!" });
                    return response.status(200).json({ RequestStatus: "Email Sent Successfully!" });
                });
            }
        }

    } catch (error) {
        if (error) {
            return response.status(400).json({ RequestStatus: "Error while Email Verification!" });
        }
    }
});
// Verify Verification Code for Password Resetting
userAuthRouter.post("/verifyCode", async (request, response) => {
    const { userEmail, verificationCode } = request.body;
    // Validation
    if (!userEmail) return response.status(400).json({ RequestStatus: "userEmail is Required!" });
    else if (!verificationCode || verificationCode.length < 6) return response.status(400).json({ RequestStatus: "Invalid Verification Code!" });
    // 
    try {
        const getUser = JSON.parse(JSON.stringify(await userCredentialModel.findOne({ userEmail, verificationCode })));
        if (!getUser) {
            return response.status(404).json({ RequestStatus: "User Not Exist!" });
        }
        else if (getUser._id && getUser.verificationCode !== verificationCode) {
            return response.status(400).json({ RequestStatus: "Verification code Expired!" });
        }
        else if (getUser._id && getUser.verificationCode === verificationCode) {
            await userCredentialModel.updateOne({ userEmail }, { $set: { verificationCode: 0 } });
            return response.status(200).json({ RequestStatus: "Code Verified Successfully!" });
        }
    } catch (error) {
        if (error) {
            return response.status(400).json({ RequestStatus: "Error while Verify Code!" });
        }
    }
});
// Password Resetting
userAuthRouter.post("/passwordReset", async (request, response) => {
    const { userEmail, NewPassword } = request.body;
    // Validation
    if (!userEmail) return response.status(400).json({ RequestStatus: "userEmail is Required!" });
    if (!NewPassword) return response.status(400).json({ RequestStatus: "NewPassword is Required!" });
    // 
    try {
        if (!await userCredentialModel.findOne({ userEmail })) {
            return response.status(404).json({ RequestStatus: "User Not Exist!" });
        }
        else {
            const HashedPassword = await bcrypt.hash(NewPassword, 10);
            await userCredentialModel.updateOne({ userEmail }, { userPassword: HashedPassword });
            return response.status(200).json({ RequestStatus: "New Password updated!" });
        }
    } catch (error) {
        if (error) {
            return response.status(400).json({ RequestStatus: "Error while passWord Resetting!" });
        }
    }
});
// Logout userSession
userAuthRouter.get("/logout", async (request, response) => {
    if (request?.signedCookies?._UAID) {
        response.clearCookie("_UAID", {
            secure: false,
            signed: true,
            httpOnly: true
        });
        return response.status(200).json({ RequestStatus: "Logout Successfully!" });
    }
    else {
        return response.status(404).json({ RequestStatus: "Session already not Exist!" });
    }
});
// protected Route for verify user Token
userAuthRouter.get("/verifyToken", verifyToken, async (request, response) => {
    if (request?.verifiedUser) {
        return response.status(200).json({ RequestStatus: "Token Verified Successfully!", Token_Data: request?.verifiedUser });
    }
});
// Exporting Auth-Router
module.exports = { userAuthRouter };