const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const { errorResponse } = require('../utils/response.js');
const constants = require("../constants/message.constant.js")
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.info('[auth.middleware] bearer auth check', {
    method: req.method,
    path: req.originalUrl,
    hasAuthHeader: Boolean(authHeader),
  });

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('[auth.middleware] missing/invalid bearer header');
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
      console.warn('[auth.middleware] bearer token verify failed', {
        error: err.message,
      });
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
        errorResponse({
          message: constants.ERROR_MESSAGE.INVALID_TOKEN,
          details: 'Token is invalid or expired',
          statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
        })
      );
    }

    req.user = decodedUser;
    console.info('[auth.middleware] bearer token verified', {
      userId: decodedUser.userId || decodedUser.id || null,
      role: decodedUser.role || null,
    });
    next();
  });
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  console.info('[auth.middleware] cookie auth check', {
    method: req.method,
    path: req.originalUrl,
    hasCookieToken: Boolean(token),
  });

  if (!token) {
    console.warn('[auth.middleware] missing cookie token');
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
      console.warn('[auth.middleware] cookie token verify failed', {
        error: err.message,
      });
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
        errorResponse({
          message: constants.ERROR_MESSAGE.INVALID_TOKEN,
          details: "Token is invalid or expired",
          statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
        })
      );
    }

    req.user = decodedUser;
    console.info('[auth.middleware] cookie token verified', {
      userId: decodedUser.userId || decodedUser.id || null,
      role: decodedUser.role || null,
    });
    next();
  });
};

module.exports = {
  authMiddleware,
  verifyToken
};