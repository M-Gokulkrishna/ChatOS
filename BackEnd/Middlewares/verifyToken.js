const JWT = require("jsonwebtoken");
// 
const verifyToken = async (request, response, next) => {
    const JWT_TOKEN = request?.signedCookies?._UAID;
    if (!JWT_TOKEN) {
        return response.status(400).json({ RequestStatus: "Session Token Expired!" });
    }
    else {
        const TokenVerificationResponse = JWT.verify(JWT_TOKEN, process.env.JWT_SECRET_KEY);
        if (TokenVerificationResponse?.userID) {
            request.verifiedUser = TokenVerificationResponse;
            next();
        }
        else {
            return response.status(400).json({ RequestStatus: "Invalid / Expired JWT Token!" });
        }
    }
}
// 
module.exports = { verifyToken };