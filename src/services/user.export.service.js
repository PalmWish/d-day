const prisma = require('../config/prisma');
const { ROLE } = require('../constants/role.constant');

function mapUsersForExport(users) {
  return users.map((user) => ({
    email: user.email,
    studentId: user.studentId || '',
    name: user.name,
    role: user.role,
    stamp: user._count.stamps,
    createdAt: user.created_at,
  }));
}

async function getStudentsForExport() {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: [ROLE.SIT_STUDENT, ROLE.STUDENT],
      },
    },
    include: {
      _count: {
        select: {
          stamps: true,
        },
      },
    },
    orderBy: [
      {
        created_at: 'asc',
      },
      {
        stamps: {
          _count: 'desc',
        },
      },
    ],
  });

  console.log(users);
  

  return mapUsersForExport(users);
}

async function getGuestsForExport() {
  const users = await prisma.user.findMany({
    where: {
      role: ROLE.GUEST,
    },
    include: {
      _count: {
        select: {
          stamps: true,
        },
      },
    },
    orderBy: [
      {
        created_at: 'asc',
      },
      {
        stamps: {
          _count: 'desc',
        },
      },
    ],
  });

  return mapUsersForExport(users);
}

async function getAllKmuttStudents() {
  return getStudentsForExport();
}

module.exports = {
  getStudentsForExport,
  getGuestsForExport,
  getAllKmuttStudents,
};
