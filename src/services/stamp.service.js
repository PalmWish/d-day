const stampRepo = require('../repositories/stamp.repository.js');
const { STAMP_THRESHOLD } = require('../constants/stamp.constant.js');

const getStampCount = async (userId, role) => {
    const stampCount = await stampRepo.countStampsByUserId(userId)

    const requiredStamps = STAMP_THRESHOLD[role] || 99;

    const canVote = stampCount >= STAMP_THRESHOLD[role];

    return {
        stampCount,
        requiredStamps,
        role,
        canVote
    }
}

module.exports = {
    getStampCount
};