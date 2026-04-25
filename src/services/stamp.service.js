const stampRepo = require('../repositories/stamp.repository.js');
const boothRepo = require('../repositories/booth.repository.js');
const { STAMP_THRESHOLD } = require('../constants/stamp.constant.js');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');
const { ERROR_MESSAGE } = require('../constants/message.constant.js');
const voteRepo = require('../repositories/vote.repository.js');

const getStampCount = async (userId, role) => {
  const stampCount = await stampRepo.countStampsByUserId(userId);

  const requiredStamps = await voteRepo.getRoleThreshold(role) || 99;

  const canVote = stampCount >= requiredStamps;

  return {
    stampCount,
    requiredStamps: requiredStamps.required_stamps,
    role,
    canVote,
  };
};

const createStamp = async (userId, code) => {
  if (!code) {
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

  const booth = await boothRepo.findByCode(code);
  if (!booth) {
    throw {
      statusCode: HTTP_STATUS_CODE.NOT_FOUND,
      message: ERROR_MESSAGE.BOOTH_NOT_FOUND,
    };
  }
  console.log(booth);
  console.log(booth.id);

  const isAlreadyStamped = await stampRepo.findByUserAndBoothCode(userId, code);
  if (isAlreadyStamped) {
    throw {
      statusCode: HTTP_STATUS_CODE.CONFLICT,
      message: ERROR_MESSAGE.ALREADY_STAMPED,
    };
  }

  const newStamp = await stampRepo.createStamp(userId, booth.id);
 
  const totalStamps = await stampRepo.countStampsByUserId(userId);
  
  return {
    stampId: newStamp.id,
    boothId: booth.name,
    stampedAt: newStamp.stamped_at,
    totalStamps: totalStamps,
  };
};

module.exports = {
  getStampCount,
  createStamp,
};
