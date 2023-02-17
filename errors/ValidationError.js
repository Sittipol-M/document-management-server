const { httpStatusCodes } = require("../helpers/httpStatusCode");

class ValidationError extends Error {
  constructor({ message, errors }) {
    super(message);
    this.errors = errors;
    this.status = httpStatusCodes.BAD_REQUEST;
  }
}

module.exports = { ValidationError };
