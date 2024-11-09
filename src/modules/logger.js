const winston = require('winston');
const config = require('../config');

const customFormatter = winston.format((info) => {
  if (info.level === 'error') {
    const errorMsg = info.stack || info.toString();
    info.message += `\n${errorMsg}`;
  }
  return info;
})();
const transports = [];
if (config.ENV !== 'development') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat(),
      ),
    }),
  );
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        customFormatter,
        winston.format.cli(),
      ),
    }),
  );
}
/**
 *  error: 0,
 *  warn: 1,
 *  info: 2,
 *  http: 3,
 *  verbose: 4,
 *  debug: 5,
 *  silly: 6
 * @type {winston.Logger}
 */
const LoggerInstance = winston.createLogger({
  level: config.LOG_LEVEL,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports,
});

module.exports = LoggerInstance;
