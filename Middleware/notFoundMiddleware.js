const { StatusCodes } = require("http-status-codes");
const notFoundMidleware = (req, res) =>
  res.status(StatusCodes.NOT_FOUND).send("<h1>Page Not Found</h1>");

module.exports = notFoundMidleware;
