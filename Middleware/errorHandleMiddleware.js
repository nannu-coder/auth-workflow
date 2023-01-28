const errorHandleMiddleware = (err, req, res, next) => {
  console.log("err->", err);
};

module.exports = errorHandleMiddleware;
