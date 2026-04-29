const { exportJsonToExcelMultiSheetBuffer } = require('../utils/excelExporter');
const userService = require('../services/user.export.service');
const adminService = require('../services/admin.threshold.service.js');
const { successResponse } = require('../utils/response.js');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');

function createTimestampForFilename() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}

const STUDENT_EXPORT_HEADERS = ['StudentId', 'Email', 'Name', 'Stamp'];
const GUEST_EXPORT_HEADERS = ['Email', 'Name', 'Stamp'];

async function exportUserData(req, res, next) {
  try {
    const [students, guests] = await Promise.all([
      userService.getStudentsForExport(),
      userService.getGuestsForExport(),
    ]);

    const studentRows = students.map((student) => ({
      StudentId: student.studentId || '',
      Email: student.email,
      Name: student.name,
      Stamp: student.stamp,
    }));

    const guestRows = guests.map((guest) => ({
      Email: guest.email,
      Name: guest.name,
      Stamp: guest.stamp,
    }));

    const timestamp = createTimestampForFilename();
    const filename = `students_and_guests_${timestamp}.xlsx`;

    const { buffer } = exportJsonToExcelMultiSheetBuffer([
      {
        data: studentRows,
        options: {
          sheetName: 'Students',
          headers: STUDENT_EXPORT_HEADERS,
          headerFillColor: '2F75B5',
          summaryFillColor: 'E2F0D9',
          summaryField: 'Stamp',
        },
      },
      {
        data: guestRows,
        options: {
          sheetName: 'Guests',
          headers: GUEST_EXPORT_HEADERS,
          headerFillColor: '7A3E00',
          summaryFillColor: 'FCE4D6',
          summaryField: 'Stamp',
        },
      },
    ]);

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
  const thresholds = await adminService.getStampThresholds();

  console.info('[admin.controller.getThresholds] Success', {
    adminId: req.user.userId,
  });

  return res.status(HTTP_STATUS_CODE.OK).json(
    successResponse({
      message: 'Thresholds retrieved successfully',
      data: thresholds,
      statusCode: HTTP_STATUS_CODE.OK,
    })
  );
};

module.exports = {
  exportUserData,
  getThresholds,
};
