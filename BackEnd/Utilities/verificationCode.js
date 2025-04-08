const { userCredentialModel } = require("../DB_Models/userCredentialModel");
// 
const getVerificationCode = async (userEmail) => {
    const verificationCode = Math.floor((Math.random() * 900000) + 100000);
    try {
        await userCredentialModel.findOneAndUpdate({ userEmail }, { $set: { verificationCode } });
        new Promise(async (resolve) => {
            resolve(setTimeout(async() => {
                await userCredentialModel.findOneAndUpdate({ userEmail }, { $set: { verificationCode: 0 } });
            }, 1000 * 60 * 2))
        });
        return verificationCode;
    } catch (error) {
        if (error) {
            return "Error while fetching verification code to DB!";
        }
    }
}
// 
module.exports = { getVerificationCode };