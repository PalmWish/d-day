const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');

function successResponse({ message, data = null, statusCode = HTTP_STATUS_CODE.OK }) {
  return {
    success: true,
    message,
    data,
    statusCode,
    error: null,
  };
}

function errorResponse({
  message,
  details = null,
  statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
  data = null,
}) {
  return {
    success: false,
    message,
    data,
    statusCode,
    error: {
      details,
    },
  };
}

module.exports = {
  successResponse,
  errorResponse,
};
