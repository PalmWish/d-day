const adminBoothRepository = require('../repositories/admin.booth.repository');

const getBoothTrackingDashboard = async () => {
  const booths = await adminBoothRepository.getBoothsWithStats();

  return booths
    .map(booth => ({
      code: booth.code,
      boothId: booth.booth_id,
      name: booth.project_name,
      totalStamps: booth._count.stampedBy,
      totalVotes: booth._count.votes
    }))
    .sort((a, b) => b.totalStamps - a.totalStamps);
};

module.exports = { getBoothTrackingDashboard };