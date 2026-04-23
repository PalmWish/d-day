const adminBoothRepository = require('../repositories/admin.booth.repository');

const getBoothTrackingDashboard = async () => {
  const booths = await adminBoothRepository.getBoothsWithStats();

  return booths
    .map(booth => ({
      boothId: booth.id,
      name: booth.name,
      totalStamps: booth._count.stampedBy,
      totalVotes: booth._count.votes
    }))
    .sort((a, b) => b.totalStamps - a.totalStamps);
};

module.exports = { getBoothTrackingDashboard };