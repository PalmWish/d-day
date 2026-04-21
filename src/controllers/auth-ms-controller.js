const config = require("../config/config.js");
const authMsService = require("../services/auth-ms-service.js");

const loginWithMicrosoft = (req, res) => {
    const authUrl = `${config.microsoft.authEndpoint}?client_id=${config.microsoft.clientId}&response_type=code&redirect_uri=${config.microsoft.redirectUri}&response_mode=query&scope=User.Read`;
    
    res.redirect(authUrl);
};

const microsoftCallback = async (req, res) => {
    try {
        const authCode = req.query.code;

        if (!authCode) {
            return res.status(401).json({ 
                success: false, 
                message: "INVALID_AUTH_CODE",
                data: null,
                statusCode: 401,
                error: { details: "No authorization code provided from Microsoft" }
            });
        }
        // console.log("Auth Code Received:", authCode);

        const authRes = await authMsService.microsoftLogin(authCode);
        // console.log(authRes);
        const { accessToken } = authRes;

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.redirect(`/`);
        // return res.status(200).json(authRes);
        
    } catch (err) {
        console.error("Callback Error:", err);
        res.redirect(`/?error=${encodeURIComponent(err.message)}`);
    }
}

module.exports = {
    loginWithMicrosoft,
    microsoftCallback,
};