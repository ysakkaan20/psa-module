const redis = require('redis');
const base64url = require('base64url');
const session = require('express-session');
const urlJoin = require('url-join');
const cookieParser = require('cookie-parser');
const RedisStore = require('connect-redis')(session);

/**
 * Usage
 * require('psa-module').v2.session({ app, baseURL: SITE_BASE_URL });
 * allowedUserTypes is optional
 */

module.exports = ({ app, allowedUserTypes = ['employee'], baseURL = '/' }) => {
  /**
     *
     *   Session Config
     *   Stores in Redis (production)
     *
     */
  const config = require('../config');
  const { info } = require('./logger');

  const redisConfig = {
    host: config.REDIS.HOST,
    port: config.REDIS.PORT,
    db: config.REDIS.DB_SESSION,
  };
  if (config.REDIS.PASSWORD) {
    redisConfig.password = config.REDIS.PASSWORD;
  }
  if (config.REDIS.USER) {
    redisConfig.user = config.REDIS.USER;
  }
  const redisClient = redis.createClient(redisConfig);
  const options = {
    name: config.SESSION.COOKIE_NAME,
    resave: false,
    saveUninitialized: true, // don't create session until something stored
    secret: config.SESSION.SECRET,
    cookie: {
      domain: config.SESSION.DOMAIN,
      maxAge: config.SESSION.COOKIE_AGE,
    }, // Default 1 Day , When session init for new user
    store: new RedisStore({ client: redisClient, prefix: config.SESSION.STORE_PREFIX }),
    expires: true,
  };
  if (!app) return session(options);
  app.use(cookieParser());
  app.use(session(options));
  app.use((req, res, next) => {
    if (req.session && req.session.accounts && req.session.accounts.length && req.session.loginAs >= 0) {
      const activeUser = req.session.accounts[req.session.loginAs];
      /** if user type is what it is given */
      if (allowedUserTypes.indexOf(activeUser.userType) > -1) {
        req.activeUser = activeUser;
      }
    }
    next();
  });
  app.get('/g/auth/logout', (req, res, next) => {
    res.redirect(`${config.AUTH.SERVER_URL}auth/logout`);
  });
  app
    .get('/g/auth/account',
      async (req, res, next) => {
        try {
          if (req.activeUser) {
            return res.send(`<iframe src="${config.AUTH.SERVER_URL}account?sourceURL=${baseURL}" width="100%" height="100%" style="border: none;"></iframe>`);
          }
          next();
        } catch (e) {
          next(e);
        }
      });
  app.get('/g/auth/login', (req, res, next) => {
    const rurl = urlJoin(baseURL, (req.query.state ? req.query.state : ''));
    res.redirect(`${config.AUTH.SERVER_URL}auth/login?rurl=${base64url(rurl)}`);
  });
  info('✌️ Session loaded');
};
