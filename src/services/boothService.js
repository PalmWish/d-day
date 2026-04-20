const boothRepository = require('../repositories/boothRepository');

const getBoothsWithStampStatus = async (userId) => {
  const booths = await boothRepository.findAllWithUserStamps(userId);

  return booths.map(({ stamps, ...boothData }) => ({
    ...boothData,
    isStamped: stamps.length > 0
  }));
};

module.exports = { getBoothsWithStampStatus };