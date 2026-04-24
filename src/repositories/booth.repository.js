const prisma = require('../config/prisma');

const findById = async (id) => {
  const result = await prisma.booth.findUnique({
    where: { id },
  });

  return result;
};

const findByCode = async (code) => {
  const result = await prisma.booth.findUnique({
    where: { code },
  });

  return result;
};

const findAllWithUserStamps = async (userId) => {
  console.info('[booth.repository] findAllWithUserStamps query', { userId });

  const result = await prisma.booth.findMany({
    include: {
      stampedBy: {
        where: { user_id: userId },
      },
    },
  });

  console.info('[booth.repository] findAllWithUserStamps result', {
    userId,
    count: result.length,
  });
  return result;
};

const findOneWithUserStamp = async (boothId, userId) => {
  console.info('[booth.repository] findOneWithUserStamp query', {
    boothId,
    userId,
  });
  const result = await prisma.booth.findUnique({
    where: { id: boothId },
    include: {
      stampedBy: {
        where: { user_id: userId },
      },
    },
  });
  console.info('[booth.repository] findOneWithUserStamp result', {
    boothId,
    userId,
    found: Boolean(result),
  });
  return result;
};

module.exports = { findById, findByCode, findAllWithUserStamps, findOneWithUserStamp };
