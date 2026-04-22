const prisma = require('../config/prisma');

const countStampsByUserId = async (userId) => {
    return await prisma.stamp.count({
        where: {
            userId: userId 
        }
    });
};

module.exports = {
    countStampsByUserId
};