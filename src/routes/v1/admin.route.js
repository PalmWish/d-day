const express = require('express');
const adminController = require('../../controllers/admin.controller');

const router = express.Router();

router.get('/export/students', adminController.exportStudents);

module.exports = router;
