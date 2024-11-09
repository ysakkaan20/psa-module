const appConfig = require('../../config');
/**
 *
 * @param {app<Express>}
 *
 * req.isLocalNetwork boolean
 */
module.exports = (req, res, next) => {
  let { ip } = req;
  ip = ip === '::1' || ip.indexOf('127.0.0.1') > -1 ? '127.0.0.1' : req.ip;
  req.isLocalNetwork = ip.indexOf(appConfig.LOCAL_NETWORK_IP) === 0;
  next();
};
