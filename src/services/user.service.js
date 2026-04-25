const userRepository = require('../repositories/user.repository.js');
const stampRepo = require('../repositories/stamp.repository.js');
const voteRepository = require('../repositories/vote.repository.js');

const getUserProfileByEmail = async (email) => {
  if (!email) {
    return null;
  }

  const user = await userRepository.findByEmail(email);

  if (!user) {
    return null;
  }

  const stampCount = await stampRepo.countStampsByUserId(user.id);
  const vote = await voteRepository.findVoteByUserId(user.id);
  const threshold = await voteRepository.getRoleThreshold(user.role)
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    stampCount: stampCount ?? 0,
    voteBooth: vote
      ? {
          ...vote.booth,
          voteAt: vote.voted_at,
        }
      : null,
    stampMax: threshold.required_stamps || 0,
  };
};

module.exports = {
  getUserProfileByEmail,
};
