const httpStatus = require('http-status');

const healthCheck = (req, res) => {
  res.status(httpStatus.OK).json({
    status: 'ok',
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  healthCheck,
};
