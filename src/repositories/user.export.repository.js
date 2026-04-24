const prisma = require('../config/prisma');
const { ROLE } = require('../constants/role.constant');

const USER_EXPORT_INCLUDE = {
  _count: {
    select: {
      stamps: true,
    },
  },
};

const USER_EXPORT_ORDER_BY = [
  {
    created_at: 'asc',
  },
  {
    stamps: {
      _count: 'desc',
    },
  },
];

async function findStudentsForExport() {
  return prisma.user.findMany({
    where: {
      role: {
        in: [ROLE.SIT_STUDENT, ROLE.STUDENT],
      },
    },
    include: USER_EXPORT_INCLUDE,
    orderBy: USER_EXPORT_ORDER_BY,
  });
}

async function findGuestsForExport() {
  return prisma.user.findMany({
    where: {
      role: ROLE.GUEST,
    },
    include: USER_EXPORT_INCLUDE,
    orderBy: USER_EXPORT_ORDER_BY,
  });
}

module.exports = {
  findStudentsForExport,
  findGuestsForExport,
};
