const express = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/export/students', verifyToken, isAdmin, adminController.exportStudents);
router.get('/export/guests', verifyToken, isAdmin, adminController.exportGuest);

router.get('/thresholds', verifyToken, isAdmin, adminController.getThresholds);

module.exports = router;
