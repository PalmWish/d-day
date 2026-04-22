const express = require('express');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get('/export/students', adminController.exportStudents);
router.get('/export/guests', adminController.exportGuest);

module.exports = router;
