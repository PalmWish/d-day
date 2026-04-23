const adminBoothRepository = require('../repositories/admin.booth.repository');

const getBoothTrackingDashboard = async () => {
  const booths = await adminBoothRepository.getBoothsWithStats();

  return booths
    .map(booth => ({
      boothId: booth.id,
      name: booth.name,
      code: booth.code,
      totalStamps: booth._count.stamps,
      totalVotes: booth._count.votes
    }))
    .sort((a, b) => b.totalStamps - a.totalStamps);
};

module.exports = { getBoothTrackingDashboard };