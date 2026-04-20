const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findAllWithUserStamps = async (userId) => {
  return await prisma.booth.findMany({
    include: {
      stamps: {
        where: { userId }
      }
    }
  });
};

module.exports = { findAllWithUserStamps };