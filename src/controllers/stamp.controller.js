const stampService = require('../services/stamp.service.js');
const { successResponse } = require('../utils/response.js');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');

const getStampCount = async (req, res, next) => {
  try {
    const { userId, role } = req.user;

    const stampData = await stampService.getStampCount(userId, role);

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'Stamp count retrieved successfully',
        data: stampData,
        statusCode: HTTP_STATUS_CODE.OK,
      })
    );
  } catch (err) {
    next(err);
  }
};

const createStamp = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { boothId } = req.body;

    const result = await stampService.createStamp(userId, boothId);

    return res.status(HTTP_STATUS_CODE.CREATED).json(
      successResponse({
        message: 'Stamp recorded successfully',
        data: result,
        statusCode: HTTP_STATUS_CODE.CREATED,
      })
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStampCount,
  createStamp,
};
