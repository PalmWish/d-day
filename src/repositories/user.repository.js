const prisma = require('../config/prisma');

const findById = async (userId) => {
    return await prisma.user.findUnique({ where: { id: userId } });
};

const findByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email: email } });
};

const createUser = async (userData) => {
    return await prisma.user.create({
        data: {
            email: userData.email,
            studentId: userData.studentId,
            name: userData.name,
            role: userData.role,
        }
    });
};

module.exports = { findById, findByEmail, createUser };