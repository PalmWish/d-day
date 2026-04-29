const axios = require('axios');
const { URLSearchParams } = require('url');
const config = require('../config/config.js');

const getAccessTokenFromCode = async (authCode) => {
  const response = await axios.post(
    config.eventpop.tokenEndpoint,
    new URLSearchParams({
      client_id: config.eventpop.clientId,
      client_secret: config.eventpop.clientSecret,
      code: authCode,
      redirect_uri: config.eventpop.callbackUrl,
      grant_type: 'authorization_code',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
};

const getEventpopProfile = async (accessToken) => {
  const response = await axios.get(config.eventpop.profileEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

const getOrganizerTickets = async (accessToken) => {
  const response = await axios.get(config.eventpop.organizerEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

module.exports = {
  getAccessTokenFromCode,
  getEventpopProfile,
  getOrganizerTickets,
};
