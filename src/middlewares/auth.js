const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse({
  message: 'UNAUTHORIZED',
  details = null,
  statusCode = HTTP_STATUS_CODE.UNAUTHORIZED,
  data = null,
}));
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse({
  message: 'UNAUTHORIZED',
  details = null,
  statusCode = HTTP_STATUS_CODE.UNAUTHORIZED,
  data = null,
}));
    }

    req.user = decoded; 
    
    next();
  });
};

module.exports = authMiddleware;