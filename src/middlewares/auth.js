const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const constants = require("../constants/message.constant.js")
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
      errorResponse({
        message: constants.ERROR_MESSAGE.UNAUTHORIZED,
        statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
      })
    );
  }
  req.user = user;
  next();
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
      errorResponse({
        message: constants.ERROR_MESSAGE.UNAUTHORIZED,
        details: "No authentication token provided in cookies",
        statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
      })
    );
  }

  jwt.verify(token, env.jwtSecret, (err, decodedUser) => {
    if (err) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
        errorResponse({
          message: constants.ERROR_MESSAGE.INVALID_TOKEN,
          details: "Token is invalid or expired",
          statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
        })
      );
    }

    req.user = decodedUser;
    next();
  });
};

module.exports = {
  authMiddleware,
  verifyToken
};