const { StatusCodes } = require("http-status-codes");

const showMe = async (req, res) => {
  console.log(req.signedCookies.token);
  res.send("show me");
};

module.exports = { showMe };
