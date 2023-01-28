const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./CustomAPIError");

class unAuthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = unAuthorizedError;
