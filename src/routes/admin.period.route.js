const express = require('express');
const router = express.Router();
const adminPeriodController = require('../controllers/admin.period.controller');

router.get('/stamping', adminPeriodController.getStampingPeriod);
router.put('/stamping', adminPeriodController.updateStampingPeriod);
router.get('/voting', adminPeriodController.getVotingPeriod);
router.put('/voting', adminPeriodController.updateVotingPeriod);

module.exports = router;
