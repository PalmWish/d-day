const prisma = require('../config/prisma');

const findAllWithUserStamps = async (userId) => {
  return await prisma.booth.findMany({
    include: {
      stamps: {
        where: { userId }
      }
    }
  });
};
const findOneWithUserStamp = async (boothId, userId) => {
  return await prisma.booth.findUnique({
    where: { id: boothId },
    include: {
      stamps: {
        where: { userId: userId }
      }
    }
  });
};

module.exports = { findAllWithUserStamps, findOneWithUserStamp };