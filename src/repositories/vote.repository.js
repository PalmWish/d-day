const prisma = require('../config/prisma');

const findBoothById = (id) => prisma.booth.findUnique({ where: { id } });

const getPeriodConfig = (type) =>
  prisma.periodConfig.findUnique({ where: { type } });

const countUserStamps = (userId) =>
  prisma.stamp.count({ where: { userId: userId } });

const getRoleThreshold = (role) =>
  prisma.roleThreshold.findUnique({ where: { role } });

const checkUserStampOnBooth = (userId, boothId) =>
  prisma.stamp.findUnique({
    where: { user_id_booth_id: { userId: userId, boothId: boothId } },
  });

const upsertVote = async (userId, boothId) => {
  const existingVote = await prisma.vote.findUnique({
    where: { user_id: userId },
  });

  const vote = await prisma.vote.upsert({
    where: { user_id: userId },
    update: { booth_id: boothId },
    create: { user_id: userId, booth_id: boothId },
  });

  return { vote, isNewRecord: !existingVote };
};

const findVoteByUserId = (userId) => {
  return prisma.vote.findUnique({
    where: { user_id: userId },
    select: {
      booth_id: true,
      booth: {
        select: {
          name: true,
        },
      },
      voted_at: true,
    },
  });
};

module.exports = {
  findBoothById,
  getPeriodConfig,
  countUserStamps,
  getRoleThreshold,
  checkUserStampOnBooth,
  upsertVote,
  findVoteByUserId,
};
