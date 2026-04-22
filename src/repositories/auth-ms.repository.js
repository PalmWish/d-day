const axios = require('axios');
const { URLSearchParams } = require('url');
const config = require('../config/config.js');

const getAccessTokenFromCode = async (authMSCode) => {
    const response = await axios.post(config.microsoft.tokenEndpoint,
        new URLSearchParams({
            client_id: config.microsoft.clientId,
            client_secret: config.microsoft.clientSecret,
            code: authMSCode,
            redirect_uri: config.microsoft.redirectUri,
            grant_type: 'authorization_code'
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
    return response.data.access_token;
};

const getMicrosoftProfile = async (accessMSToken) => {
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
        params: {
            '$select': 'displayName,onPremisesSamAccountName,mail'
        },
        headers: {
            Authorization: `Bearer ${accessMSToken}`
        }
    });
    
    return response.data;
};

module.exports = {
    getAccessTokenFromCode,
    getMicrosoftProfile
};