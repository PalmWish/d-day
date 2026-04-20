const path = require('path');
const dotenv = require('dotenv');

const envAliases = {
  development: 'dev',
  production: 'prod',
};

const rawEnv = process.env.NODE_ENV || 'dev';
const env = envAliases[rawEnv] || rawEnv;
const envFilePath = path.resolve(process.cwd(), `.env.${env}`);

dotenv.config({ path: envFilePath });

const config = {
  env,
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET,

  frontendUrl: process.env.FRONTEND_URL,

  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    tenantId: process.env.MICROSOFT_TENANT_ID,
    redirectUri: process.env.MICROSOFT_REDIRECT_URI,
    authEndpoint: process.env.MICROSOFT_AUTH_ENDPOINT,
    tokenEndpoint: process.env.MICROSOFT_TOKEN_ENDPOINT,
  },
};

module.exports = config;
