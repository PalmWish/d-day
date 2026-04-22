const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const countStampsByUserId = async (userId) => {
    return await prisma.stamp.count({
        where: {
            userId: userId 
        }
    });
};

const findByUserAndBooth = async (userId, boothId) => {
    return await prisma.stamp.findFirst({
        where: {
            userId: userId,
            boothId: boothId
        }
    });
};

const createStamp = async (userId, boothId) => {
    return await prisma.stamp.create({
        data: {
            userId: userId,
            boothId: boothId,
            stampedAt: new Date()
        }
    });
};

module.exports = {
    countStampsByUserId,
    findByUserAndBooth,
    createStamp,
};