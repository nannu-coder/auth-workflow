const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./CustomAPIError");

class AuthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = AuthorizedError;
