const prisma = require('../config/prisma');

const getBoothsWithStats = () => {
  return prisma.booth.findMany({
    select: {
      id: true,
      name: true,
      code: true,
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
