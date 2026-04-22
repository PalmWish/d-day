const { exportJsonToExcelBuffer } = require('../utils/excelExporter');
const studentService = require('../services/student.service');

function createTimestampForFilename() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const STUDENT_EXPORT_HEADERS = ['StudentId', 'Email', 'Name', 'Stamp'];
const GUEST_EXPORT_HEADERS = ['Email', 'Name', 'Stamp'];

async function exportStudents(req, res, next) {
  try {
    const students = await studentService.getStudentsForExport();
    const exportRows = students.map((student) => ({
      StudentId: student.studentId || '',
      Email: student.email,
      Name: student.name,
      Stamp: student.stamp,
    }));
    const timestamp = createTimestampForFilename();
    const filename = `students_${timestamp}.xlsx`;

    const { buffer } = exportJsonToExcelBuffer(exportRows, {
      sheetName: 'Students',
      headers: STUDENT_EXPORT_HEADERS,
      headerFillColor: '2F75B5',
      summaryFillColor: 'E2F0D9',
      summaryField: 'Stamp',
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    res.status(200).send(buffer);
  } catch (error) {
    next(error);
  }
}

async function exportGuest(req, res, next) {
  try {
    const guests = await studentService.getGuestsForExport();
    const exportRows = guests.map((guest) => ({
      Email: guest.email,
      Name: guest.name,
      Stamp: guest.stamp,
    }));
    const timestamp = createTimestampForFilename();
    const filename = `guests_${timestamp}.xlsx`;

    const { buffer } = exportJsonToExcelBuffer(exportRows, {
      sheetName: 'Guests',
      headers: GUEST_EXPORT_HEADERS,
      headerFillColor: '7A3E00',
      summaryFillColor: 'FCE4D6',
      summaryField: 'Stamp',
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    res.status(200).send(buffer);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  exportStudents,
  exportGuest,
};
