const prisma = require('../config/prisma');

const getBoothsWithStats = () => {
  return prisma.booth.findMany({
    include: {
      _count: {
        select: {
          stampedBy: true,
          votes: true,
        },
      },
    },
  });
};

module.exports = { getBoothsWithStats };
