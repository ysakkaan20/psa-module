const yup = require('yup');
const multer = require('multer');
const sequelize = require('@sequelize/core');
const error = require('../error');
const logger = require('../logger');
const appConfig = require('../../config');

const config = {
  render: {
    view: null,
    layout: null,
    data: {},
  },
};

const handlers = [
  (req, res, next) => {
    next(new error.NotFoundError());
  },
  (err, req, res, next) => {
    /**
     * If ex is instanceof UserFacingError
     */
    if (err instanceof error.UserFacingError) {
      return next(err);
    }
    /**
     * If ex is instanceof Database/Model Validation related errors
     */

    if (err instanceof sequelize.ValidationError) {
      const errors = err.errors
        ? err.errors.map((e) => ({ type: e.type, message: e.message, path: e.path }))
        : [];
      return next(
        new error.BadRequestError(
          err.name,
          {
            message: err.message,
            path: err.path,
            type: err.type,
            errors,
          },
        ),
      );
    } if (err instanceof sequelize.BaseError) {
      /**
       * Any other database related errors
       */
      return next(new error.ApplicationError(err));
    }
    /**
     * If ex is other errors
     */
    if (err instanceof yup.ValidationError
        || err instanceof multer.MulterError
        || err instanceof sequelize.ForeignKeyConstraintError) {
      logger.debug('Ex: (%o) Parameters: %o User ID: %s', err, { body: req.body, params: req.prams, query: req.query }, req.user ? req.user.userID : '');
      err.statusCode = err.statusCode || 400;
      return next(
        new error.BadRequestError(
          err.name,
          {
            message: err.message,
            path: err.path,
            type: err.type,
            errors: err.errors,
            data: err.data,
          },
        ),
      );
    }
    next(err);
  },
  (err, req, res, next) => {
    const statusCode = err.status || err.statusCode || 500;
    if (statusCode >= 500) {
      logger.error(err);
    }
    res.status(statusCode);
    const errObj = {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      path: err.path,
      type: err.type,
      errors: err.errors,
      data: err.data,
    };
    if (appConfig.ENV === 'production') {
      delete errObj.stack;
    }
    if (!req.xhr && config.render.view) {
      return res.render(config.render.view, {
        layout: config.render.layout,
        error: errObj,
        ...config.render.data,
      });
    }
    res.json({
      ...errObj,
    });
  },
];
/**
 *
 * @param {app<Express>, render{view,layout}}
 */
module.exports = ({ app, render }) => {
  if (render) {
    config.render = render;
  }
  app.use(handlers);
  logger.info('✌️ Error handler loaded');
};
