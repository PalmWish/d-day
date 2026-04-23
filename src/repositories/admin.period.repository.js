const prisma = require("../config/prisma");

const getStampingPeriod = () => {
  return prisma.config.findUnique({
    where: { key: 'STAMPING_PERIOD' },
    select: {
      start_at: true,
      end_at: true
    }
  });
};
const updateStampingPeriod = (startAt, endAt) => {
  return prisma.config.upsert({
    where: { key: 'STAMPING_PERIOD' },
    update: {
      start_at: new Date(startAt),
      end_at: new Date(endAt)
    },
    create: {
      key: 'STAMPING_PERIOD',
      start_at: new Date(startAt),
      end_at: new Date(endAt)
    }
  });
};

module.exports = { getStampingPeriod, updateStampingPeriod };