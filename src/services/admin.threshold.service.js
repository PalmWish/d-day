const { getBoothsWithStats } = require('../repositories/admin.threshold.repository');

const getStampThresholds = async () => {
    return await getBoothsWithStats()
};

module.exports = {
    getStampThresholds
};