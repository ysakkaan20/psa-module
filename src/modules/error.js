/* eslint-disable no-restricted-syntax */
/* eslint-disable max-classes-per-file */
// https://www.smashingmagazine.com/2020/08/error-handling-nodejs-error-classes/
// Here is the base error classes to extend from
// eslint-disable-next-line max-classes-per-file

// Do not use message key in options object (it will replace message key in error object)

class ApplicationError extends Error {
  get name() {
    return this.constructor.name;
  }

  get statusCode() {
    return 500;
  }
}

class DatabaseError extends ApplicationError {
  get statusCode() {
    return 500;
  }
}

class UserFacingError extends ApplicationError {
}

class BadRequestError extends UserFacingError {
  constructor(message, options = {}) {
    super(message);

    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }

  get statusCode() {
    return 400;
  }
}

class NotFoundError extends UserFacingError {
  constructor(message, options = {}) {
    super(message || 'Page Not Found');

    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }

  get statusCode() {
    return 404;
  }
}

class ForbiddenError extends UserFacingError {
  constructor(message, options = {}) {
    super(message);

    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }

  get statusCode() {
    return 403;
  }
}

class CustomError extends UserFacingError {
  constructor(message, options = {}) {
    super(message);

    // You can attach relevant information to the error instance
    // (e.g.. the username)

    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }

  set statusCode(c) {
    this._statusCode = c;
  }

  get statusCode() {
    return this._statusCode || 500;
  }
}

module.exports = {
  ApplicationError,
  DatabaseError,
  UserFacingError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  CustomError,
};
