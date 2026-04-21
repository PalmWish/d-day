const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }
  req.user = user;
  next();
};

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "UNAUTHORIZED",
            data: null,
            statusCode: 401,
            error: { details: "No authentication token provided in cookies" }
        });
    }

    jwt.verify(token, env.jwtSecret, (err, decodedUser) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "INVALID_TOKEN",
                data: null,
                statusCode: 401,
                error: { details: "Token is invalid or expired" }
            });
        }

        req.user = decodedUser; 
        next();
    });
};

module.exports = {
  authMiddleware,
  verifyToken
};