/*!
 *      psa-module v2.0.0
 *      Police Science Academy Sharjah.
 *      git@bitbucket.org:police-science-academy/psa-module.git
 *
 */

/**
 * Module dependencies.
 * @private
 */

/**
 * Session (Global) Middleware
 * @type {function({app: *}): void}
 */
module.exports.session = require('./modules/session');
/**
 * Flash Middleware
 * @type {function({app: *, prefix?: *}): void}
 */
module.exports.flash = require('./modules/flash');
/**
 *
 * @type {function({app: *, skip: *}): void}
 * skip urls from log eg ['/browser-sync', '/etc']
 */
module.exports.requestLogger = require('./modules/requestLogger');

/**
 *
 * @type validateUser: function(username): Promise<object>
 * @type authenticateUser: function(username, password): Promise<boolean>
 */
module.exports.activeDirectory = require('./modules/activeDirectory');

/**
 *
 * @type textEmail?: function({req?: *, subject?: *, to?: *, cc?: *, bcc?: *, data?: *}): Promise<number>}
 * @type tableEmail?: function({req?: *, subject?: *, to?: *, cc?: *, bcc?: *, data?: *}): Promise<number>}
 */
module.exports.email = require('./modules/email');

/**
 *
 * @type sendSMS: function(mobile, message, source): Promise<unknown>}
 */
module.exports.sms = require('./modules/sms');

/**
 *
 * @type findOne: (function(*=): Promise<object|boolean>)
 * @type findAll: (function(*=): Promise<[object]|boolean>)
 */
module.exports.hr = require('./modules/api/hr');
/**
 *
 * @type findOne: (function({MilitaryNo?, ADUserName?}): Promise<object|boolean>)
 * @type findAll: (function(*=): Promise<[object]|boolean>)
 */
module.exports.hrOld = require('./modules/hrOld');

/**
 *
 * @type {winston.Logger}
 * {silly, debug, verbose, http, info, warn, error}
 */
module.exports.logger = require('./modules/logger');

/**
 *
 * @type setData: (function(*=, *): Promise<object>)
 * @type getData: (function(*=): Promise<object>)
 * @type any: (function({url: *, method?: *, headers: *, body?: *}): Promise<object>)
 */
module.exports.API = require('./modules/api');

/**
 *
 * @type validateMobile: (function(mobileNumber, errorKey): Promise<string>)
 * @type validateEID: (function(emiratesID): Promise<string>)
 */
module.exports.validation = require('./modules/validation');

/**
 *
 * @type toNumber: (function(string): <Number>)
 * @type round: (function(number,precision): <Number>)
 */
module.exports.number = require('./modules/number');

module.exports.middlwares = {};
/**
 *
 * @param {app<Express>, render<Function(data)={}>}
 *
 */
module.exports.middlwares.errorHandler = require('./modules/middlewares/errorHandler');
/**
 *
 * @param {app<Express>}
 *
 * req.isLocalNetwork boolean
 */
module.exports.middlwares.localNetworkDetect = require('./modules/middlewares/localNetworkDetect');

module.exports.pagination = {};
/**
 * @type {init, res}
 *  Init function will create sequelize pagination object
 *  Res function will create response for datatable plugin
 */
module.exports.pagination.sequelize = require('./modules/pagination');
