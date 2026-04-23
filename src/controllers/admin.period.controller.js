const adminPeriodService = require('../services/admin.period.service');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');
const { successResponse, errorResponse } = require('../utils/response');

const getStampingPeriod = async (req, res, next) => {
  try {
    // REPLACE WITH admin middleware
    // if (!req.user) {
    //   return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
    //     errorResponse({
    //       message: 'UNAUTHORIZED',
    //       details: 'Token is missing or invalid',
    //       statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
    //       data: null,
    //     })
    //   );
    // }

    // if (req.user.role !== 'ADMIN') {
    //   return res.status(HTTP_STATUS_CODE.FORBIDDEN).json(
    //     errorResponse({
    //       message: 'FORBIDDEN',
    //       details: 'You do not have permission to access',
    //       statusCode: HTTP_STATUS_CODE.FORBIDDEN,
    //       data: null,
    //     })
    //   );
    // }

    const data = await adminPeriodService.getStampingPeriod();

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'SUCCESS',
        statusCode: HTTP_STATUS_CODE.OK,
        data,
      })
    );
  } catch (error) {
    next(error);
  }
};

const updateStampingPeriod = async (req, res, next) => {
  try {
    // REPLACE WITH admin middleware
    // if (!req.user)
    //   return res
    //     .status(HTTP_STATUS_CODE.UNAUTHORIZED)
    //     .json(
    //       errorResponse({
    //         message: 'UNAUTHORIZED',
    //         details: null,
    //         statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
    //         data: null,
    //       })
    //     );

    // if (req.user.role !== 'ADMIN')
    //   return res
    //     .status(HTTP_STATUS_CODE.FORBIDDEN)
    //     .json(
    //       errorResponse({
    //         message: 'FORBIDDEN',
    //         details: null,
    //         statusCode: HTTP_STATUS_CODE.FORBIDDEN,
    //         data: null,
    //       })
    //     );

    const { startAt, endAt } = req.body;

    if (!startAt || !endAt) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(
        errorResponse({
          message: 'BAD_REQUEST',
          details: 'startAt and endAt are required',
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          data: null,
        })
      );
    }

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (startDate >= endDate) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(
        errorResponse({
          message: 'INVALID_PERIOD_RANGE',
          details: 'startAt must be earlier than endAt',
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
          data: null,
        })
      );
    }

    const data = await adminPeriodService.updateStampingPeriod(startAt, endAt);

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'SUCCESS',
        statusCode: HTTP_STATUS_CODE.OK,
        data: data,
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getStampingPeriod, updateStampingPeriod };
