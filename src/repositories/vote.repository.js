const prisma = require('../config/prisma');

const findBoothById = (id) => prisma.booth.findUnique({ where: { id } });

const findBoothByCode = (code) => prisma.booth.findUnique({ where: { code } });

const getPeriodConfig = (type) =>
  prisma.periodConfig.findUnique({ where: { type } });

const countUserStamps = (userId) =>
  prisma.stamp.count({ where: { user_id: userId } });

const getRoleThreshold = (role) =>
  prisma.roleThreshold.findUnique({ where: { role } });

const checkUserStampOnBooth = (userId, boothId) =>
  prisma.stamp.findUnique({
    where: { user_id_booth_id: { user_id: userId, booth_id: boothId } },
  });

const upsertVote = async (userId, boothId) => {
  const existingVote = await prisma.vote.findUnique({
    where: { user_id: userId },
  });

  if (!existingVote) {
    const vote = await prisma.vote.create({
      data: {
        user_id: userId,
        booth_id: boothId,
      },
    });
    return { vote, isNewRecord: true };
  }

  const vote = await prisma.vote.update({
    where: { user_id: userId },
    data: {
      booth_id: boothId,
      voted_at: new Date(),
    },
  });

  return { vote, isNewRecord: false };
};

const findVoteByUserId = (userId) => {
  return prisma.vote.findUnique({
    where: { user_id: userId },
    include: { booth: true },
  });
};

module.exports = {
  findBoothById,
  findBoothByCode,
  getPeriodConfig,
  countUserStamps,
  getRoleThreshold,
  checkUserStampOnBooth,
  upsertVote,
  findVoteByUserId,
};
