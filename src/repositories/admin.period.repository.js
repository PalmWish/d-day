const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStampingPeriod = () => {
  return prisma.config.findUnique({
    where: { key: 'STAMPING_PERIOD' },
    select: {
      start_at: true,
      end_at: true
    }
  });
};

module.exports = { getStampingPeriod };