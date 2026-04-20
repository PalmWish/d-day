const { successResponse } = require('../utils/response');
const boothService = require('../services/boothService');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');

const getAllBooths = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await boothService.getBoothsWithStampStatus(userId);
    
    return res.status(HTTP_STATUS_CODE.OK).json(successResponse({
        message: "Successfully fetched all booths",
        data: result,
        statusCode: HTTP_STATUS_CODE.OK
      }));
  } catch (error) {
    console.error("error:", error);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
    .json(errorResponse({
  message:"INTERNAL_SERVER_ERROR",
  details = null,
  statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
  data = null,
}));
  }
};

//----------------GetByID---------------------------------
const getBoothById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const boothId = parseInt(id);
    if (isNaN(boothId)) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse({
  message:"BAD_REQUEST",
  details = null,
  statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
  data = null,
}));
    }

    const result = await boothService.getBoothDetail(boothId, userId);

    if (!result) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(errorResponse({
  message:"NOT_FOUND",
  details = null,
  statusCode = HTTP_STATUS_CODE.NOT_FOUND,
  data = null,
}));
    }
    return res.status(HTTP_STATUS_CODE.OK).json(successResponse({
        message: "Successfully fetched the booth",
        data: result,
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

module.exports = { getAllBooths, getBoothById };