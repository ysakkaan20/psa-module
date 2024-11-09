/**
 * Module dependencies.
 */
const axios = require('axios');
const config = require('../../../config');
const {
  info, silly, debug, error,
} = require('../../logger');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ApplicationError,
} = require('../../error');

let token = null;

const findOne = async (militaryNo) => {
  try {
    if (!militaryNo) throw new BadRequestError('Military Number not provided');

    /**
         * Auth
         * Fetch token
         */

    if (!token) {
      const result = await axios({
        method: 'post',
        url: `${config.HR.URL}account/login`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          userName: config.HR.USERNAME,
          password: config.HR.PASSWORD,
        },
      });
      if (result && result.data.token) { token = result.data.token; }
    }
    if (token) {
      /**
        * Fetch emp
        */
      const response = await axios({
        method: 'get',
        url: `${config.HR.URL}EmployeeManagement/Employee/GetEmployeeFullDetails/${militaryNo}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        // silly(response)
        return response.data;
      }
      throw new NotFoundError('Employee not found');
    }
    throw new ForbiddenError('Invalid authentication');
  } catch (e) {
    token = null;
    error(e);
    return false;
  }
};
/**
 *
 * @returns {Promise<[{employeeID,arabicEmployeeName,englishEmployeeName,departmentID,rankId,positionID,managerEmployeeId,employeeMobileNo,employeeEmail,status}]>}
 */
const findAll = async () => {
  try {
    /**
     * Auth
     * Fetch token
     */

    const result = await axios({
      method: 'post',
      url: `${config.HR.URL}account/login`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        userName: config.HR.USERNAME,
        password: config.HR.PASSWORD,
      },
    });

    if (result && result.data.token) {
      /**
             * Fetch emp
             */
      const { token: userToken } = result.data;
      const response = await axios({
        method: 'get',
        url: `${config.HR.URL}Client/Employee/GetEmployee`,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response) {
        return response.data;
      }
      throw new NotFoundError('Employees not found');
    }
    throw new ForbiddenError('Invalid authentication');
  } catch (e) {
    error(e);
    return e;
  }
};
/**
 *
 * @return {Function}
 * @api public
 */
module.exports = {
  findOne,
  findAll,
};
