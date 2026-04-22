const adminPeriodRepository = require('../repositories/admin.period.repository');

const getStampingPeriod = async () => {
  const period = await adminPeriodRepository.getStampingPeriod();

  if (!period) {
    return {
      startAt: null,
      endAt: null
    };
  }

  return {
    startAt: period.start_at,
    endAt: period.end_at
  };
};

module.exports = { getStampingPeriod };