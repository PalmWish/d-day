const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getBoothsWithStats = () => {
  return prisma.booth.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          stamps: true,
          votes: true
        }
      }
    }
  });
};

module.exports = { getBoothsWithStats };