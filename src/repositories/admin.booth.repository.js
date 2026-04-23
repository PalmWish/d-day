const prisma = require('../config/prisma');

const getBoothsWithStats = () => {
  return prisma.booth.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      _count: {
        select: {
          stamps: true,
          votes: true,
        },
      },
    },
  });
};

module.exports = { getBoothsWithStats };
