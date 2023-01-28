const { unAuthenticateError } = require("../Errors");
const { verifyJWT } = require("../Utils/JWT");

const authenTicate = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new unAuthenticateError("Invalid Authorization");
  }

  try {
    const { name, id, role } = await verifyJWT({ token });
    req.user = { name, id, role };
    next();
  } catch (error) {
    throw new unAuthenticateError("Invalid Authorization");
  }
};

module.exports = authenTicate;