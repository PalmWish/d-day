const prisma = require('../config/prisma');

const countStampsByUserId = async (userId) => {
  return await prisma.stamp.count({
    where: {
      user_id: userId,
    },
  });
};

const findByUserAndBooth = async (userId, boothId) => {
  return await prisma.stamp.findFirst({
    where: {
      user_id: userId,
      booth_id: boothId,
    },
  });
};

const createStamp = async (userId, boothId) => {
  return await prisma.stamp.create({
    data: {
      user_id: userId,
      booth_id: boothId,
      stamped_at: new Date(),
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
