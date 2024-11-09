const axios = require('axios');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ApplicationError,
} = require('../../error');
const logger = require('../../logger');
const config = require('../../../config');

axios.defaults.baseURL = config.HELPDESK_API.URL;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const issueTicket = async (body) => {
  try {
    const resp = await axios.post('/ticket', {
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
const issueTicketITEdu = async ({ Subject, Body, IssuerUserName }) => await issueTicket({
  Subject,
  Body,
  SectionID: config.HELPDESK_API.IT_SECTION_ID,
  CategoryID: config.HELPDESK_API.EDU_CATEGOY_ID,
  UserName: config.HELPDESK_API.USERNAME,
  IssuerUserName,
});

module.exports = {
  issueTicketITEdu,
  issueTicket,
};
