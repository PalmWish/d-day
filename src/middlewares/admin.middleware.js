const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');
const { errorResponse } = require('../utils/response');
const msgConstants = require('../constants/message.constant');

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(HTTP_STATUS_CODE.FORBIDDEN).json(
      errorResponse({
        message: msgConstants.ERROR_MESSAGE.FORBIDDEN,
        details: 'Access denied. Admin role required.',
        statusCode: HTTP_STATUS_CODE.FORBIDDEN,
      })
    );
  }

  next();
};

module.exports = isAdmin;
