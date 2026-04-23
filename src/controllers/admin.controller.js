const { exportJsonToExcelBuffer } = require('../utils/excelExporter');
const studentService = require('../services/student.service');
const adminService = require('../services/admin.service.js');
const { successResponse, errorResponse } = require('../utils/response.js');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');
const { get } = require('../app.js');

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

    res.status(HTTP_STATUS_CODE.OK).send(buffer);
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

    res.status(HTTP_STATUS_CODE.OK).send(buffer);
  } catch (error) {
    next(error);
  }
}

const getThresholds = async (req, res, next) => {
    try {
        const thresholds = await adminService.getStampThresholds();

        console.info('[admin.controller.getThresholds] Success', {
            adminId: req.user.userId
        });

        return res.status(HTTP_STATUS_CODE.OK).json(
            successResponse({
                message: "Thresholds retrieved successfully",
                data: thresholds,
                statusCode: HTTP_STATUS_CODE.OK
            })
        );
    } catch (err) {
        next(err);
    }
};

module.exports = {
  exportStudents,
  exportGuest,
  getThresholds,
};
