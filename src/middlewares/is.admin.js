const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');

const isAdmin = (req, res, next) => {
   if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
      message: 'Access denied. Admins only.',
      details: null,
      statusCode: HTTP_STATUS_CODE.FORBIDDEN,
      data: null
    });
  }
};

module.exports = isAdmin;