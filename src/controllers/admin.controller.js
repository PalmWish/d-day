const { exportJsonToExcelBuffer } = require('../utils/excelExporter');
const studentService = require('../services/student.service');

function createTimestampForFilename() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function exportStudents(req, res, next) {
  try {
    const students = studentService.getStudentsForExport();
    const timestamp = createTimestampForFilename();
    const filename = `students_${timestamp}.xlsx`;

    const { buffer } = exportJsonToExcelBuffer(students, {
      sheetName: 'Students',
      headerFillColor: '2F75B5',
      summaryFillColor: 'E2F0D9',
      summaryField: 'stamp',
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
};
