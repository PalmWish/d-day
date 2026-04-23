const prisma = require('../config/prisma');

const countStampsByUserId = async (userId) => {
  return await prisma.stamp.count({
    where: {
      userId: userId,
    },
  });
};

const findByUserAndBooth = async (userId, boothId) => {
  return await prisma.stamp.findFirst({
    where: {
      userId: userId,
      boothId: boothId,
    },
  });
};

const createStamp = async (userId, boothId) => {
  return await prisma.stamp.create({
    data: {
      userId: userId,
      boothId: boothId,
      stampedAt: new Date(),
    },
  });
};

const getPeriodConfig = async (type) => {
  return await prisma.periodConfig.findUnique({
    where: { type },
  });
};

module.exports = {
  countStampsByUserId,
  findByUserAndBooth,
  createStamp,
  getPeriodConfig,
};
