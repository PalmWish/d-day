const config = require("../config/config.js");
const authMsService = require("../services/auth-ms-service.js");
const constants = require("../constants/message.constant.js")

const loginWithMicrosoft = (req, res) => {
    const authUrl = `${config.microsoft.authEndpoint}?client_id=${config.microsoft.clientId}&response_type=code&redirect_uri=${config.microsoft.redirectUri}&response_mode=query&scope=User.Read`;
    
    res.redirect(authUrl);
};

const microsoftCallback = async (req, res) => {
    try {
        const authCode = req.query.code;

        if (!authCode) {
            return res.status(401).json(
                errorResponse({
                    message: constants.MESSAGE.INVALID_AUTH_CODE,
                    details: "No authorization code provided from Microsoft",
                    statusCode: 401,
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
        // return res.status(200).json(authRes);
        
    } catch (err) {
        console.error("Callback Error:", err);
        res.redirect(`${config.frontendUrl}/?error=${encodeURIComponent(err.message)}`);
    }
}

module.exports = {
    loginWithMicrosoft,
    microsoftCallback,
};