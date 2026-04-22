const userRepository = require('../repositories/user.repository.js');

const getUserProfile = async (email) => {
    if (!email) {
        return null;
    }

    const user = await userRepository.findByEmail(email);

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