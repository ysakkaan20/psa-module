/**
 * Module dependencies.
 */
const { format } = require('util');
const { isArray } = require('util');
const {
  info, silly, debug, error,
} = require('./logger');

/**
 * Expose `flash()` function on requests.
 *
 * @return {Function}
 * @api public
 */
function flash(options) {
  options = options || {};
  const safe = (options.unsafe === undefined) ? true : !options.unsafe;
  const prefix = (options.prefix === undefined) ? '' : options.prefix;
  const { resFn } = options;

  return function (req, res, next) {
    if (req.flash && safe) {
      return next();
    }
    req.flash = _flash;
    req.flashPush = _flashPush;
    req.flashE = (function (msg) {
      if (!msg) return req.flash(`${prefix}errorMessage`);
      if (resFn) msg = res[resFn](msg);
      return new Promise((fulfill, reject) => {
        req.flash(`${prefix}errorMessage`, msg);
        req.session.save((err) => {
          if (err) return reject(err);
          return fulfill();
        });
      });
    });
    req.flashS = (function (msg) {
      if (!msg) return req.flash(`${prefix}successMessage`);
      if (resFn) msg = res[resFn](msg);
      return new Promise((fulfill, reject) => {
        req.flash(`${prefix}successMessage`, msg);
        req.session.save((err) => {
          if (err) return reject(err);
          return fulfill();
        });
      });
    });
    req.flashW = (function (msg) {
      if (!msg) return req.flash(`${prefix}warningMessage`);
      if (resFn) msg = res[resFn](msg);
      return new Promise((fulfill, reject) => {
        req.flash(`${prefix}warningMessage`, msg);
        req.session.save((err) => {
          if (err) return reject(err);
          return fulfill();
        });
      });
    });
    req.flashI = (function (msg) {
      if (!msg) return req.flash(`${prefix}infoMessage`);
      if (resFn) msg = res[resFn](msg);
      return new Promise((fulfill, reject) => {
        req.flash(`${prefix}infoMessage`, msg);
        req.session.save((err) => {
          if (err) return reject(err);
          return fulfill();
        });
      });
    });
    next();
  };
}

/**
 * Queue flash `msg` of the given `type`.
 *
 * Examples:
 *
 *      req.flash('info', 'email sent');
 *      req.flash('error', 'email delivery failed');
 *      req.flash('info', 'email re-sent');
 *      // => 2
 *
 *      req.flash('info');
 *      // => ['email sent', 'email re-sent']
 *
 *      req.flash('info');
 *      // => []
 *
 *      req.flash();
 *      // => { error: ['email delivery failed'], info: [] }
 *
 * Formatting:
 *
 * Flash notifications also support arbitrary formatting support.
 * For example you may pass letiable arguments to `req.flash()`
 * and use the %s specifier to be replaced by the associated argument:
 *
 *     req.flash('info', 'email has been sent to %s.', userName);
 *
 * Formatting uses `util.format()`, which is available on Node 0.6+.
 *
 * @param {String} type
 * @param {String} msg
 * @return {Array|Object|Number}
 * @api public
 */
function _flash(type, msg, cb) {
  if (this.session === undefined) throw Error('req.flash() requires sessions');
  const msgs = this.session.flash = this.session.flash || {};
  if (type && msg) {
    return msgs[type] = (msg);
  }
  if (type) {
    const arr = msgs[type];
    delete msgs[type];
    return arr || [];
  }
  this.session.flash = {};
  return msgs;
}

function _flashPush(type, msg, cb) {
  if (this.session === undefined) throw Error('req.flash() requires sessions');
  const msgs = this.session.flash = this.session.flash || {};
  if (type && msg) {
    // util.format is available in Node.js 0.6+
    if (arguments.length > 2 && format) {
      const args = Array.prototype.slice.call(arguments, 1);
      msg = format.apply(undefined, args);
    } else if (isArray(msg)) {
      msg.forEach((val) => {
        (msgs[type] = msgs[type] || []).push(val);
      });
      return msgs[type].length;
    }
    return (msgs[type] = msgs[type] || []).push(msg);
  }
  if (type) {
    const arr = msgs[type];
    delete msgs[type];
    return arr || [];
  }
  this.session.flash = {};
  return msgs;
}

module.exports = ({ app, prefix = '' }) => {
  app.use(flash({ prefix }));
  app.use((req, res, next) => {
    res.locals[`${prefix}successMessage`] = req.flashS();
    res.locals[`${prefix}errorMessage`] = req.flashE();
    res.locals[`${prefix}infoMessage`] = req.flashI();
    res.locals[`${prefix}warningMessage`] = req.flashW();
    next();
  });
  info('✌️ Flash loaded');
};
