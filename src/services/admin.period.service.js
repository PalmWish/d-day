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

const updateStampingPeriod = async (startAt, endAt) => {
  const updated = await adminPeriodRepository.updateStampingPeriod(startAt, endAt);
  return {
    startAt: updated.start_at,
    endAt: updated.end_at
  };
};

module.exports = { getStampingPeriod, updateStampingPeriod };