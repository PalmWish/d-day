const adminPeriodService = require('../services/admin.period.service');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');

const getStampingPeriod = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        message: 'UNAUTHORIZED',
        details: 'Token is missing or invalid',
        statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
        data: null
      });
    }

    if (req.user.role !== 'ADMIN') {
      return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        message: 'FORBIDDEN',
        details: 'You do not have permission to access',
        statusCode: HTTP_STATUS_CODE.FORBIDDEN,
        data: null
      });
    }

    const data = await adminPeriodService.getStampingPeriod();

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: 'SUCCESS',
      statusCode: HTTP_STATUS_CODE.OK,
      data: data
    });
  } catch (error) {
     return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
    .json(errorResponse({
  message:"INTERNAL_SERVER_ERROR",
  details = null,
  statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
  data = null,
}));
  }
};

module.exports = { getStampingPeriod };