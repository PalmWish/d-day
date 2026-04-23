const adminBoothService = require('../services/admin.booth.service');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');
const { successResponse, errorResponse } = require('../utils/response');

const getBoothsTracking = async (req, res, next) => {
  try {
    const data = await adminBoothService.getBoothTrackingDashboard();
    return res.status(HTTP_STATUS_CODE.OK).json(successResponse({
        message: 'Successfully fetched booth tracking data',
        data: data,
        statusCode: HTTP_STATUS_CODE.OK
      }));
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse({
  message:"INTERNAL_SERVER_ERROR",
  details = null,
  statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
  data = null,
}));
  }  
}; 

module.exports = { getBoothsTracking };