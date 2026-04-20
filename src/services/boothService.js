const boothRepository = require('../repositories/boothRepository');

const getBoothsWithStampStatus = async (userId) => {
  const booths = await boothRepository.findAllWithUserStamps(userId);

  return booths.map(({ stamps, ...boothData }) => ({
    ...boothData,
    isStamped: stamps.length > 0
  }));
};
const getBoothDetail = async (boothId, userId) => {
  const booth = await boothRepository.findOneWithUserStamp(boothId, userId);

  if (!booth) return null;

  const { stamps, ...boothData } = booth;
  return {
    ...boothData,
    isStamped: stamps.length > 0
  };
};
module.exports = { getBoothsWithStampStatus, getBoothDetail };