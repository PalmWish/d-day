const prisma = require('../config/prisma');

const getStampingPeriod = () => {
  return prisma.periodConfig.findUnique({
    where: { type: 'STAMPING' },
    select: {
      start_at: true,
      end_at: true,
    },
  });
};

const updateStampingPeriod = (startAt, endAt) => {
  return prisma.periodConfig.upsert({
    where: { type: 'STAMPING' },
    update: {
      start_at: new Date(startAt),
      end_at: new Date(endAt),
    },
    create: {
      type: 'STAMPING',
      start_at: new Date(startAt),
      end_at: new Date(endAt),
    },
  });
};

const getVotingPeriod = () => {
  return prisma.periodConfig.findUnique({
    where: { type: 'VOTING' },
    select: {
      start_at: true,
      end_at: true,
    },
  });
};

const updateVotingPeriod = (startAt, endAt) => {
  return prisma.periodConfig.upsert({
    where: { type: 'VOTING' },
    update: {
      start_at: new Date(startAt),
      end_at: new Date(endAt),
    },
    create: {
      type: 'VOTING',
      start_at: new Date(startAt),
      end_at: new Date(endAt),
    },
  });
};

module.exports = {
  getStampingPeriod,
  updateStampingPeriod,
  getVotingPeriod,
  updateVotingPeriod,
};
