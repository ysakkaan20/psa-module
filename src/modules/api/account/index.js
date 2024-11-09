const axios = require('axios');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ApplicationError,
} = require('../../error');
const logger = require('../../logger');
const config = require('../../../config');

axios.defaults.baseURL = config.ACCOUNT_API_URL;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const getData = async function (url) {
  try {
    const resp = await axios.get(url);
    logger.silly('resp from API %j', resp.data);
    return resp.data;
  } catch (error) {
    logger.silly(error.message);
    if (error.response && error.response.data) {
      logger.silly('resp from API %j', error.response.data);
      if (error.response.data.error) throw new Error(error.response.data.error.message);
    }
    throw new ApplicationError(error.message);
  }
};
const setData = async function (url, body) {
  try {
    const resp = await axios.post(url, {
      ...body,
    });
    logger.silly('resp from API %j', resp.data);
    return resp.data;
  } catch (error) {
    logger.silly(error.message);
    if (error.response && error.response.data) {
      logger.silly('resp from API %j', error.response.data);
      if (error.response.data.error) throw new Error(error.response.data.error.message);
    }
    throw new ApplicationError(error.message);
  }
};
const any = async function ({
  url,
  method = 'GET',
  headers,
  body,
}) {
  try {
    const resp = await axios({
      url,
      data: body,
      method,
      headers,
    });
    logger.silly('resp from API %j', resp.data);
    return resp.data;
  } catch (error) {
    logger.silly(error.message);
    if (error.response && error.response.data) {
      logger.silly('resp from API %j', error.response.data);
      if (error.response.data.error) throw new Error(error.response.data.error.message);
    }
    throw new ApplicationError(error.message);
  }
};
module.exports = {
  getData,
  setData,
  any,
};
