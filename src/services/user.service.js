const userRepository = require('../repositories/user.repository.js');

const getUserProfile = async (userId) => {
    const user = await userRepository.findById(userId);

    if (!user) { return null; }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    };
};

module.exports = {
    getUserProfile
};