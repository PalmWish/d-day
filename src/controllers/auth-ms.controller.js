const config = require("../config/config.js");
const authMsService = require("../services/auth-ms.service.js");
const constants = require("../constants/message.constant.js")
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');
const { errorResponse } = require("../utils/response.js")
const loginWithMicrosoft = (req, res) => {
    const authUrl = `${config.microsoft.authEndpoint}?client_id=${config.microsoft.clientId}&response_type=code&redirect_uri=${config.microsoft.redirectUri}&response_mode=query&scope=User.Read`;
    
    res.redirect(authUrl);
};

const microsoftCallback = async (req, res) => {
    try {
        const authCode = req.query.code;

        if (!authCode) {
            return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
                errorResponse({
                    message: constants.ERROR_MESSAGE.INVALID_AUTH_CODE,
                    details: "No authorization code provided from Microsoft",
                    statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
                })
            );
        }
        // console.log("Auth Code Received:", authCode);

        const authRes = await authMsService.microsoftLogin(authCode);
        // console.log(authRes);
        const { accessToken } = authRes;

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === config.PRODUCTION,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.redirect(`${config.frontendUrl}/`);
        
    } catch (err) {
        console.error("Callback Error:", err);
        res.redirect(`${config.frontendUrl}/?error=${encodeURIComponent(err.message)}`);
    }
}

module.exports = {
    loginWithMicrosoft,
    microsoftCallback,
};