const adminPeriodService = require('../services/admin.period.service');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');
const { ERROR_MESSAGE } = require('../constants/message.constant');
const { successResponse, errorResponse } = require('../utils/response');

const ISO_8601_REGEX =
  /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(?:\.(\d+))?(?:Z|[+-](?:(?:0\d|1[0-3]):[0-5]\d|14:00))$/;

const isValidIsoDateTime = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const matchedParts = value.match(ISO_8601_REGEX);
  if (!matchedParts) {
    return false;
  }

  const year = Number(matchedParts[1]);
  const month = Number(matchedParts[2]);
  const day = Number(matchedParts[3]);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));

  if (
    calendarDate.getUTCFullYear() !== year ||
    calendarDate.getUTCMonth() !== month - 1 ||
    calendarDate.getUTCDate() !== day
  ) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
};

const getStampingPeriod = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
        errorResponse({
          message: ERROR_MESSAGE.UNAUTHORIZED,
          details: 'Token is missing or invalid',
          statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
        })
      );
    }

    if (req.user.role !== 'ADMIN') {
      return res.status(HTTP_STATUS_CODE.FORBIDDEN).json(
        errorResponse({
          message: ERROR_MESSAGE.FORBIDDEN,
          details: 'You do not have permission to access',
          statusCode: HTTP_STATUS_CODE.FORBIDDEN,
        })
      );
    }
}}

const getStampingPeriod = async (req, res, next) => {
  try {
    const data = await adminPeriodService.getStampingPeriod();

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'SUCCESS',
        statusCode: HTTP_STATUS_CODE.OK,
        data,
      })
    );
  } catch {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(
      errorResponse({
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      })
    );
  }
};

const updateStampingPeriod = async (req, res, next) => {
  try {
    const { startAt, endAt } = req.body;

    if (
      startAt === null ||
      startAt === undefined ||
      endAt === null ||
      endAt === undefined
    ) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(
        errorResponse({
          message: ERROR_MESSAGE.VALIDATION_ERROR,
          details: 'startAt and endAt are required',
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
        })
      );
    }

    if (!isValidIsoDateTime(startAt) || !isValidIsoDateTime(endAt)) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(
        errorResponse({
          message: ERROR_MESSAGE.VALIDATION_ERROR,
          details: 'startAt and endAt must be valid ISO8601 datetime strings',
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
        })
      );
    }

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (startDate >= endDate) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(
        errorResponse({
          message: ERROR_MESSAGE.INVALID_PERIOD_RANGE,
          details: 'startAt must be earlier than endAt',
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
        })
      );
    }

    const data = await adminPeriodService.updateStampingPeriod(startAt, endAt);

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'SUCCESS',
        statusCode: HTTP_STATUS_CODE.OK,
        data,
      })
    );
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(
      errorResponse({
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        details: error.message,
        statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      })
    );
  }
};

const getVotingPeriod = async (req, res, next) => {
  try {
    const data = await adminPeriodService.getVotingPeriod();

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

const updateVotingPeriod = async (req, res, next) => {
  try {
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

    const data = await adminPeriodService.updateVotingPeriod(startAt, endAt);

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

module.exports = {
  getStampingPeriod,
  updateStampingPeriod,
  getVotingPeriod,
  updateVotingPeriod,
};
