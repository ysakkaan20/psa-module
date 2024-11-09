const Queue = require('bull');
const browser = require('browser-detect');
const moment = require('moment');
const config = require('../config');
const {
  silly, info, debug, error,
} = require('./logger');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ApplicationError,
} = require('./error');

const redisConfig = {
  host: config.REDIS.HOST,
  port: config.REDIS.PORT,
  db: config.REDIS.DB_EMAIL_QUEUE,
};
if (config.REDIS.PASSWORD) {
  redisConfig.password = config.REDIS.PASSWORD;
}
if (config.REDIS.USER) {
  redisConfig.user = config.REDIS.USER;
}
let sendMailQueue = null;
if (redisConfig.host) {
  sendMailQueue = new Queue(config.QUEUE.EMAIL.NAME, {
    redis: redisConfig,
    defaultJobOptions: {
      priority: config.QUEUE.EMAIL.PRIORITY,
      delay: config.QUEUE.EMAIL.DELAY,
      attempts: config.QUEUE.EMAIL.ATTEMPTS,
    },
  });
}

/** *
 *
 * Email
 * data = {to,subject,body}
 * */

module.exports.textEmail = async function ({
  req,
  subject,
  to,
  cc,
  bcc,
  data: mailData,
}) {
  if (!sendMailQueue) {
    throw new ApplicationError('sendMailQueue is not initialized');
  }
  try {
    if (!subject) throw new BadRequestError('subject is required');
    if (!to) throw new BadRequestError('to email address is required');
    if (!mailData) throw new BadRequestError('data is required');
    if (!mailData.body) throw new BadRequestError('body in data is required');

    if (config.ENV !== 'production') return 1;

    const data = {
      subject,
      to,
      cc: cc || null,
      bcc: bcc || null,
      template: 'text',
      data: {
        title: mailData.title || subject,
        body: mailData.body,
        lng: mailData.lng || 'ar',
        attachments: mailData.attachments,
        info: req ? local.getInfo(req) : null,
      },
    };

    const job = await sendMailQueue.add(data);
    info(`Job created ${job.id}`);
    return job.id;
  } catch (e) {
    // console.error(e)
    throw new ApplicationError(e);
  }
};

module.exports.tableEmail = async function ({
  req,
  subject,
  to,
  cc,
  bcc,
  data: mailData,
}) {
  if (!sendMailQueue) {
    throw new ApplicationError('sendMailQueue is not initialized');
  }
  try {
    if (!subject) throw new BadRequestError('subject is required');
    if (!to) throw new BadRequestError('to email address is required');
    if (!mailData) throw new BadRequestError('data is required');
    if (!mailData.list || !mailData.list.length) throw new BadRequestError('list in data is required');

    if (config.ENV !== 'production') return 1;

    const data = {
      subject,
      to,
      cc: cc || null,
      bcc: bcc || null,
      template: 'table',
      data: {
        title: mailData.title || subject,
        list: mailData.list,
        lng: mailData.lng || 'ar',
        attachments: mailData.attachments,
        info: req ? local.getInfo(req) : null,
      },
    };

    const job = await sendMailQueue.add(data);
    info(`Job created ${job.id}`);
    return job.id;
  } catch (e) {
    console.error(e);
    throw new ApplicationError(e);
  }
};

const local = {

  getInfo(req) {
    if (!req) return null;

    const resultBrowser = browser(req.headers['user-agent']);

    let ip = req.header('x-forwarded-for') || req.ip;
    ip = ip.indexOf(':') !== -1 ? 'LOCAL NETWORK' : ip;

    silly('IP: %s', ip);
    return {
      browser: `${resultBrowser.name} ${resultBrowser.version}`,
      device: resultBrowser.os,
      datetime: moment(new Date()).format('D MMM YYYY, h:mm A'),
      timeZone: 'Gulf Standard Time',
      location: 'Dubai - United Arab Emirates (May not accurate)',
      ip,
    };
  },
};
