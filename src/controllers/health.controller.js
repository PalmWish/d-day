const { successResponse } = require('../utils/response');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');

const healthCheck = (req, res) => {
  res
    .status(HTTP_STATUS_CODE.OK)
    .json(
      successResponse({
        message: 'Service is healthy',
        data: {
          status: 'ok',
          timestamp: new Date().toISOString(),
        },
        statusCode: HTTP_STATUS_CODE.OK,
      })
    );
};

module.exports = {
  healthCheck,
};
