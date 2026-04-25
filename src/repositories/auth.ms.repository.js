const axios = require('axios');
const { URLSearchParams } = require('url');
const config = require('../config/config.js');

const getAccessTokenFromCode = async (authMSCode) => {
    console.info('[auth-ms.repository] requesting access token', {
        tokenEndpoint: config.microsoft.tokenEndpoint,
        hasCode: Boolean(authMSCode),
    });

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

    console.info('[auth-ms.repository] access token response received');
    return response.data.access_token;
};

const getMicrosoftProfile = async (accessMSToken) => {
    console.info('[auth-ms.repository] requesting Microsoft profile', {
        hasAccessToken: Boolean(accessMSToken),
    });

    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
        params: {
            '$select': 'displayName,onPremisesSamAccountName,mail'
        },
        headers: {
            Authorization: `Bearer ${accessMSToken}`
        }
    });
    console.info('[auth-ms.repository] Microsoft profile response received');
    
    return response.data;
};

module.exports = {
    getAccessTokenFromCode,
    getMicrosoftProfile
};