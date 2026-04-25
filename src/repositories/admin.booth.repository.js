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
    orderBy: {
      booth_id: 'asc',
    },
  });
};

module.exports = { getBoothsWithStats };
