const moment = require('moment');
const morgan = require('morgan');
const config = require('../config');
const {
  info, silly, debug, error,
} = require('./logger');

const prodTemplate = ':ip - :remote-user [:realclfdate] ":method :url HTTP/:http-version" :status :req[content-length] :res[content-length] :response-time ms ":referrer" ":user-agent" ":userName"';

/**
 * Usage
 * require('psa-module').v2.requestLogger({ app, options: {userKey: '', ignoreURLs: []} });
 * useKey eg.
 *  session.userName, session.activeUser.username, user.username etc
 *  (from req object)
 * ignoreURLs
 *  array of url ignores to log
 *  eg. ["/browser-sync", "/pages", "/assets"]
 *
 * 304 status will ignore by default
 */
module.exports = ({ app, options }) => {
  /**
     *
     *  set requests logs
     *
     */
  morgan.token('realclfdate', (req, res) => {
    moment.locale('en');
    return moment().format('DD/MMM/YYYY HH:MM:SS');
  });
  morgan.token('ip', (req, res) => req.header('x-forwarded-for') || req.ip);
  morgan.token('userName', (req, res) => {
    if (options && options.userKey && options.userKey.length) { return Object.byString(req, options.userKey); }
    if (req.session && req.session.userName) { return req.session.userName; }
    if (req.user && req.user.userName) { return req.user.userName; }
    return '';
  });
  app.use(morgan((config.ENV === 'production'
    ? prodTemplate
    : 'dev'), {
    skip(req, res) {
      let skip = false;
      if (options && options.ignoreURLs && options.ignoreURLs.length) {
        for (const uri of options.ignoreURLs) {
          if (req.originalUrl.startsWith(uri)) {
            skip = true;
            break;
          }
        }
      }
      return res.statusCode === 304 || skip;
    },
  }));
  info('✌️ Request logger loaded');
};
