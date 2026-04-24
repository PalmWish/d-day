const userExportRepository = require('../repositories/user.export.repository');

function mapUsersForExport(users) {
  return users.map((user) => ({
    email: user.email,
    studentId: user.studentId || '',
    name: user.name,
    role: user.role,
    stamp: user._count.stamps,
    createdAt: user.created_at,
  }));
}

async function getStudentsForExport() {
  const users = await userExportRepository.findStudentsForExport();

  return mapUsersForExport(users);
}

async function getGuestsForExport() {
  const users = await userExportRepository.findGuestsForExport();

  return mapUsersForExport(users);
}

async function getAllKmuttStudents() {
  return getStudentsForExport();
}

module.exports = {
  getStudentsForExport,
  getGuestsForExport,
  getAllKmuttStudents,
};
