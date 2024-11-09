/**
 * Created by Awaismehmood on 7/16/17.
 */

const querystring = require('querystring');
const http = require('http');
const config = require('../config');
const {
  info, silly, debug, error,
} = require('./logger');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ApplicationError,
} = require('./error');

const sendSMS = function (mobile, message, source = config.SMS.SMS_SOURCE) {
  return new Promise((fulfill, reject) => {
    if (mobile && message) {
      if (!(/^(971)\d{9}$/gm).test(mobile)) reject(new BadRequestError('Invalid mobile number eg. 971501234567'));
      if (message === '') reject(new BadRequestError('Message is required'));

      if (config.ENV !== 'production') return fulfill();

      const postData = querystring.stringify({
        source,
        to: mobile,
        text: message,
      });

      const options = {
        hostname: config.SMS.HOST,
        port: config.SMS.PORT,
        path: config.SMS.PATH,
        method: 'POST',
        headers: {
          Authorization: config.SMS.AUTH,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
      };
      if (!options.hostname) {
        return reject(new ApplicationError('SMS host is not configured'));
      }

      const req = http.request(options, (resp) => {
        resp.setEncoding('utf8');
        debug(`SMS. STATUS: ${resp.statusCode}`);
        // console.log('HEADERS: ' + JSON.stringify(resp.headers));

        let responseString = '';

        resp.on('data', (data) => {
          responseString += data;
        });
        resp.on('end', () => {
          try {
            debug(`SMS. response: ${responseString}`);
            responseString = JSON.parse(responseString);

            if (resp.statusCode === 200 && responseString.success) {
              info(`SMS. MessageId: ${responseString.MessageId}`);
              return fulfill(responseString);
            }
            return reject(new BadRequestError(responseString.message));
          } catch (e) {
            reject(new ApplicationError(e.message));
          }
        });
      });

      req.on('error', (e) => {
        console.error(`SMS. error: ${e.message}`);
        reject(new ApplicationError(e.message));
      });

      req.write(postData);
      req.end();
    } else {
      error('SMS. Number(s) or Message not provided');
      reject(new BadRequestError('Number(s) or Message not provided'));
    }
  });
};

module.exports = {
  sendSMS,
};
