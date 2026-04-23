const { successResponse, errorResponse } = require('../utils/response');
const boothService = require('../services/boothService');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');

const getAllBooths = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    console.info('[booth.controller] getAllBooths start', { userId });

    const result = await boothService.getBoothsWithStampStatus(userId);

    console.info('[booth.controller] getAllBooths success', {
      userId,
      totalBooths: result.length,
    });

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'Successfully fetched all booths',
        data: result,
        statusCode: HTTP_STATUS_CODE.OK,
      })
    );
  } catch (error) {
    console.error('[booth.controller] getAllBooths failed', {
      error: error.message,
      stack: error.stack,
    });
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(
      errorResponse({
        message: 'INTERNAL_SERVER_ERROR',
        details: null,
        statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        data: null,
      })
    );
  }
};

//----------------GetByID---------------------------------
const getBoothById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;

<<<<<<< HEAD:src/controllers/booth.controller.js
    const boothId = parseInt(id);
    if (isNaN(boothId)) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse({
  message:"BAD_REQUEST",
  details = null,
  statusCode = HTTP_STATUS_CODE.BAD_REQUEST,
  data = null,
}));
    }
=======
    console.info('[booth.controller] getBoothById start', {
      boothId: id,
      userId,
    });
>>>>>>> dev:src/controllers/boothController.js

    const result = await boothService.getBoothDetail(id, userId);

    if (!result) {
      console.warn('[booth.controller] getBoothById not found', {
        boothId: id,
        userId,
      });
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(
        errorResponse({
          message: 'NOT_FOUND',
          details: null,
          statusCode: HTTP_STATUS_CODE.NOT_FOUND,
          data: null,
        })
      );
    }

    console.info('[booth.controller] getBoothById success', {
      boothId: id,
      userId,
    });

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'Successfully fetched the booth',
        data: result,
        statusCode: HTTP_STATUS_CODE.OK,
      })
    );
  } catch (error) {
    console.error('[booth.controller] getBoothById failed', {
      error: error.message,
      stack: error.stack,
    });
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(
      errorResponse({
        message: 'INTERNAL_SERVER_ERROR',
        details: null,
        statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        data: null,
      })
    );
  }
};

module.exports = { getAllBooths, getBoothById };
