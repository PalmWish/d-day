const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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