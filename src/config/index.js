const ENVPrefix = 'G_';

function getEnv(key) {
  return process.env[ENVPrefix + key];
}

const dotConf = { silent: true };
if (process.env.ENV_FILE_GLOBAL) {
  dotConf.path = process.env.ENV_FILE_GLOBAL;
  const fs = require('fs');
  if (!fs.existsSync(dotConf.path)) {
    console.log('ENV global file doesnt exist on : ', dotConf.path);
    process.exit();
  }
}
require('dotenv').config(dotConf);

const env = getEnv('NODE_ENV') || process.env.NODE_ENV;

if (typeof env === 'undefined' || !env) {
  console.error(new Error('ENV global file not provided'));
  process.exit();
}

module.exports = {
  ENV: env,
  LOG_LEVEL: getEnv('LOG_LEVEL'),
  APP_NAME: getEnv('APP_NAME'),
  ACCOUNT_API_URL: getEnv('ACCOUNT_API_URL'),
  LOCAL_NETWORK_IP: getEnv('LOCAL_NETWORK_IP'),
  SESSION: {
    COOKIE_NAME: getEnv('SESSION_COOKIE_NAME'),
    SECRET: getEnv('SESSION_SECRET'),
    COOKIE_AGE: parseInt(getEnv('SESSION_COOKIE_AGE')),
    COOKIE_AGE_REMEMBER_ME: parseInt(getEnv('SESSION_COOKIE_AGE_REMEMBER_ME')),
    STORE_PREFIX: getEnv('SESSION_STORE_PREFIX'),
    DOMAIN: getEnv('SESSION_DOMAIN') || 'localhost',
  },
  REDIS: {
    HOST: getEnv('REDIS_HOST'),
    PORT: getEnv('REDIS_PORT'),
    USER: getEnv('REDIS_USER'),
    PASSWORD: getEnv('REDIS_PASSWORD'),
    DB_CACHE: getEnv('REDIS_DB_CACHE'),
    DB_SESSION: getEnv('REDIS_DB_SESSION'),
    DB_EMAIL_QUEUE: getEnv('REDIS_DB_EMAIL_QUEUE'),
  },
  DB_HR: {
    DIALECT: getEnv('DB_HR_DIALECT'),
    DATABASE: getEnv('DB_HR_NAME'),
    USERNAME: getEnv('DB_HR_USER'),
    PASSWORD: getEnv('DB_HR_PASS'),
    HOST: getEnv('DB_HR_HOST'),
    PORT: getEnv('DB_HR_PORT'),
    QUERY_LOG: false,
  },
  HR: {
    URL: getEnv('HR_URL'),
    USERNAME: getEnv('HR_USERNAME'),
    PASSWORD: getEnv('HR_PASSWORD'),
  },
  DOMAIN: {
    URL: getEnv('AD_URL'),
    BASE_DN: getEnv('AD_BASE_DN'),
    USERNAME: getEnv('AD_USERNAME'),
    PASSWORD: getEnv('AD_PASSWORD'),
    USER_PREFIX: getEnv('AD_USER_PREFIX'),
  },
  SMS: {
    HOST: getEnv('SMS_HOST'),
    PORT: getEnv('SMS_PORT'),
    PATH: getEnv('SMS_PATH'),
    SOURCE: getEnv('SMS_SOURCE'),
    AUTH: process.env.SMS_AUTH,
  },
  QUEUE: {
    EMAIL: {
      NAME: getEnv('QUEUE_EMAIL'),
      PRIORITY: getEnv('QUEUE_EMAIL_PRIORITY'),
      DELAY: getEnv('QUEUE_EMAIL_DELAY'),
      ATTEMPTS: getEnv('QUEUE_EMAIL_ATTEMPTS'),
    },
  },
  AUTH: {
    SERVER_URL: getEnv('AUTH_SERVER_URL'),
  },
  HELPDESK_API: {
    URL: getEnv('HELPDESK_API_URL'),
    USERNAME: getEnv('HELPDESK_API_USERNAME'),
    IT_SECTION_ID: getEnv('HELPDESK_API_IT_SECTION_ID'),
    EDU_CATEGOY_ID: getEnv('HELPDESK_API_EDU_CATEGORY_ID'),
  },

};
