const prisma = require('../config/prisma');

const getBoothsWithStats = () => {
  return prisma.roleThreshold.findMany({
    select: {
      role: true,
      required_stamps: true,
    },
  });
};

module.exports = { getBoothsWithStats };
