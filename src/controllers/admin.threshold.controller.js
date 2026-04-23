const adminService = require('../services/admin.threshold.service.js');
const { successResponse } = require('../utils/response.js');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');

const getThresholds = async (req, res, next) => {
  const thresholds = await adminService.getStampThresholds();
  console.log("threshold :", thresholds);
  

  console.info('[admin.controller.getThresholds] Success', {
    adminId: req.user.userId,
  });

  try {
    return res.status(HTTP_STATUS_CODE.OK).json(
    successResponse({
      message: 'Thresholds retrieved successfully',
      data: thresholds,
      statusCode: HTTP_STATUS_CODE.OK,
    })
  );
  } catch (error) {
    console.log(error);
  }
  
};

module.exports = {
  getThresholds,
};