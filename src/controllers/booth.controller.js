const { successResponse, errorResponse } = require('../utils/response');
const boothService = require('../services/booth.service');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');

const getAllBooths = async (req, res, next) => {
  try {
    const userId = req.user.userId
    // console.info('[booth.controller] getAllBooths start', { userId });

    const result = await boothService.getBoothsWithStampStatus(userId);

    // console.info('[booth.controller] getAllBooths success', {
    //   userId,
    //   totalBooths: result.length,
    // });

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'Successfully fetched all booths',
        data: result,
      statusCode: HTTP_STATUS_CODE.OK,
      })
    );
  } catch (error) {
    next(error)
  }
};

//----------------GetByID---------------------------------
const getBoothById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

    // console.info('[booth.controller] getBoothById start', {
    //   boothId: id,
    //   userId,
    // });

    const result = await boothService.getBoothDetail(id, userId);

    if (!result) {
      // console.warn('[booth.controller] getBoothById not found', {
      //   boothId: id,
      //   userId,
      // });
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(
        errorResponse({
          message: 'NOT_FOUND',
          details: null,
          statusCode: HTTP_STATUS_CODE.NOT_FOUND,
          data: null,
        })
      );
    }

    // console.info('[booth.controller] getBoothById success', {
    //   boothId: id,
    //   userId,
    // });

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'Successfully fetched the booth',
        data: result,
        statusCode: HTTP_STATUS_CODE.OK,
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBooths, getBoothById };
