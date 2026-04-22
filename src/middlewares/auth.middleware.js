const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const { errorResponse } = require('../utils/response.js');
const constants = require("../constants/message.constant.js")
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');

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

  const token = authHeader.split(' ')[1];

  jwt.verify(token, config.jwtSecret, (err, decodedUser) => {
    if (err) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
        errorResponse({
          message: constants.ERROR_MESSAGE.INVALID_TOKEN,
          details: 'Token is invalid or expired',
          statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
        })
      );
    }

    req.user = decodedUser;
    next();
  });
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

  jwt.verify(token, config.jwtSecret, (err, decodedUser) => {
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