const express = require('express');
const router = express.Router();
const adminPeriodController = require('../controllers/admin.period.controller');

router.get('/stamping', adminPeriodController.getStampingPeriod);

module.exports = router;