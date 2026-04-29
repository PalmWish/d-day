const boothRepository = require('../repositories/booth.repository');
const stampRepo = require('../repositories/stamp.repository')

const getBoothsWithStampStatus = async (userId) => {
  console.info('[booth.service] getBoothsWithStampStatus start', { userId });
  const booths = await boothRepository.findAllWithUserStamps(userId);
  
  return booths.map(({ stampedBy, ...boothData }) => (
    // console.log(stampedBy),
  {
    ...boothData,
    isStamped: stampedBy.length > 0,
    stampAt: stampedBy[0]?.stamped_at || null
  }));
};
const getBoothDetail = async (boothId, userId) => {
  console.info('[booth.service] getBoothDetail start', { boothId, userId });
  const booth = await boothRepository.findOneWithUserStamp(boothId, userId);

  if (!booth) {
    console.warn('[booth.service] booth not found', { boothId, userId });
    return null;
  }

  const { stampedBy, ...boothData } = booth;
  console.info('[booth.service] getBoothDetail success', {
    boothId,
    userId,
    isStamped: stampedBy.length > 0,
  });
  return {
    ...boothData,
    isStamped: stampedBy.length > 0,
  };
};
module.exports = { getBoothsWithStampStatus, getBoothDetail };