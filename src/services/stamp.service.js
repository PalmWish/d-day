const stampRepo = require('../repositories/stamp.repository.js');
const boothRepo = require('../repositories/booth.repository.js');
const { STAMP_THRESHOLD } = require('../constants/stamp.constant.js');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');
const { ERROR_MESSAGE } = require('../constants/message.constant.js');

const getStampCount = async (userId, role) => {
  const stampCount = await stampRepo.countStampsByUserId(userId);

  const requiredStamps = STAMP_THRESHOLD[role] || 99;

  const canVote = stampCount >= STAMP_THRESHOLD[role];

  return {
    stampCount,
    requiredStamps,
    role,
    canVote,
  };
};

const createStamp = async (userId, boothId) => {
  if (!boothId) {
    throw {
      statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
      message: ERROR_MESSAGE.VALIDATION_ERROR,
    };
  }

  const period = await stampRepo.getPeriodConfig('STAMPING');
  const now = new Date();

  if (!period || now < period.start_at || now > period.end_at) {
    throw {
      statusCode: HTTP_STATUS_CODE.FORBIDDEN,
      message: ERROR_MESSAGE.STAMPING_PERIOD_CLOSED,
    };
  }

  const booth = await boothRepo.findById(boothId);
  if (!booth) {
    throw {
      statusCode: HTTP_STATUS_CODE.NOT_FOUND,
      message: ERROR_MESSAGE.BOOTH_NOT_FOUND,
    };
  }

  const isAlreadyStamped = await stampRepo.findByUserAndBooth(userId, boothId);
  if (isAlreadyStamped) {
    throw {
      statusCode: HTTP_STATUS_CODE.CONFLICT,
      message: ERROR_MESSAGE.ALREADY_STAMPED,
    };
  }

  const newStamp = await stampRepo.createStamp(userId, boothId);
 
  const totalStamps = await stampRepo.countStampsByUserId(userId);
  
  return {
    stampId: newStamp.id,
    boothId: newStamp.boothId,
    stampedAt: newStamp.stampedAt,
    totalStamps: totalStamps,
  };
};

module.exports = {
  getStampCount,
  createStamp,
};
