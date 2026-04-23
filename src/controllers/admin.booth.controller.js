const adminBoothService = require('../services/admin.booth.service');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');
const { successResponse } = require('../utils/response');

const getBoothsTracking = async (req, res, next) => {
  const data = await adminBoothService.getBoothTrackingDashboard();

  return res.status(HTTP_STATUS_CODE.OK).json(
    successResponse({
      message: 'Successfully fetched booth tracking data',
      data: data,
      statusCode: HTTP_STATUS_CODE.OK,
    })
  );
};

module.exports = { getBoothsTracking };
