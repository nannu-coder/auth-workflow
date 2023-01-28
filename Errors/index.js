const unAuthenticateError = require("./AuthenticateError");
const unAuthorizedError = require("./AuthorizedError");
const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");

module.exports = {
  unAuthenticateError,
  unAuthorizedError,
  BadRequestError,
  NotFoundError,
};
