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
            return res.status(400).send("No code provided");
        }
        console.log("Auth Code Received:", authCode);

        const authRes = await authMsService.microsoftLogin(authCode);
        console.log(authRes);
        
        // const frontendUrl = config.frontendUrl || 'http://localhost:5500';
        // res.redirect(`${frontendUrl}/?token=${authRes.accessToken}`);
        return res.status(200).json(authRes);
        
    } catch (err) {
        console.error("Callback Error:", err);
        next(err)
        // const frontendUrl = config.frontendUrl || 'http://localhost:5500';
        // res.redirect(`${frontendUrl}/?error=${encodeURIComponent(err.message)}`);
    }
}

module.exports = {
    loginWithMicrosoft,
    microsoftCallback,
};