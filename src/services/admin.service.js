const { STAMP_THRESHOLD } = require('../constants/stamp.constant.js');

const getStampThresholds = async () => {
    return STAMP_THRESHOLD;
};

module.exports = {
    getStampThresholds
};