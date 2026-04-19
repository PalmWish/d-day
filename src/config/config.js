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
  appName: process.env.APP_NAME || 'd-day-api',
  apiPrefix: process.env.API_PREFIX || '/v1',
};

module.exports = config;
