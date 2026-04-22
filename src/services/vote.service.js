const voteRepository = require('../repositories/vote.repository');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');

const processVote = async (userId, userRole, boothId) => {
  const booth = await voteRepository.findBoothById(boothId);
  if (!booth) throw createError(HTTP_STATUS_CODE.NOT_FOUND, 'BOOTH_NOT_FOUND');

  const period = await voteRepository.getPeriodConfig('VOTING');
  const now = new Date();
  if (!period || now < period.start_at || now > period.end_at) {
    throw createError(HTTP_STATUS_CODE.FORBIDDEN, 'VOTING_PERIOD_CLOSED');
  }

  const [userStampCount, threshold] = await Promise.all([
    voteRepository.countUserStamps(userId),
    voteRepository.getRoleThreshold(userRole)
  ]);
  if (!threshold || userStampCount < threshold.required_stamps) {
    throw createError(HTTP_STATUS_CODE.FORBIDDEN, 'INSUFFICIENT_STAMPS');
  }

  const hasStamped = await voteRepository.checkUserStampOnBooth(userId, boothId);
  if (!hasStamped) throw createError(HTTP_STATUS_CODE.FORBIDDEN, 'MUST_STAMP_THIS_BOOTH_BEFORE_VOTE');

  const { vote, isNewRecord } = await voteRepository.upsertVote(userId, boothId);

  return {
    isNewRecord,
    data: {
      voteId: vote.id,
      boothId: vote.booth_id,
      votedAt: vote.voted_at
    }
  };
};

const getMyVote = async (userId) => {
  const vote = await voteRepository.findVoteByUserId(userId);
  
  if (!vote) return null;

  return {
    voteId: vote.id,
    boothId: vote.booth_id,
    votedAt: vote.voted_at
  };
};

module.exports = { processVote, getMyVote };