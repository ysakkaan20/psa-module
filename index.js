/**
 *      psa-module v1.0.1
 *      Police Science Academy Sharjah.
 *      git@bitbucket.org:police-science-academy/psa-module.git
 *
 */

/**
 * Module exports.
 * @public
 */

module.exports.session = require('./utils/session.config');
module.exports.morgan = require('./utils/morgan.config');
module.exports.strategy = require('./utils/strategy.config');
module.exports.flash = require('./src/modules/flash');

/**
 * send email to bull queue
 * @function textEmail
 * @param {Object} one or more values {req, subject, to, cc, bcc, data: {title, body, lng, attachments:[{fileName,filePath}]}}
 * @return queue job id
 * @public
 *
 * @function textEmail
 * @param {Object} one or more values {req, subject, to, cc, bcc, data: {title, body, lng, attachments:[{fileName,filePath}]}}
 * @return queue job id
 * @public
 */

module.exports.email = require('./src/modules/email');

/**
 * Query From PSA HR
 * @function findOne
 * @param {Object} one or more values {MilitaryNo, ADUserName}
 * @return {Object} Object or throw exception
 * @public
 *
 * @function findAll
 * @return {Object} Object or throw exception
 * @public
 */

module.exports.hr = require('./src/modules/hrOld');

module.exports.newhr = require('./src/modules/api/hr');

module.exports.v2 = require('./src');
