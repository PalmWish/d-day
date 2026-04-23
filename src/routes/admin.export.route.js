const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/students', adminController.exportStudents);
router.get('/guests', adminController.exportGuest);

module.exports = router;