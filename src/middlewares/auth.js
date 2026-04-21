const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const constants = require("../constants/message.constant.js")

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(
      errorResponse({
        message: constants.MESSAGE.UNAUTHORIZED,
        statusCode: 401,
      })
    );
  }
  req.user = user;
  next();
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json(
      errorResponse({
        message: constants.MESSAGE.UNAUTHORIZED,
        details: "No authentication token provided in cookies",
        statusCode: 401,
      })
    );
  }

  jwt.verify(token, env.jwtSecret, (err, decodedUser) => {
    if (err) {
      return res.status(401).json(
        errorResponse({
          message: constants.MESSAGE.INVALID_TOKEN,
          details: "Token is invalid or expired",
          statusCode: 401,
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