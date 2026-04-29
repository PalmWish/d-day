const express = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const router = express.Router();

const adminBoothsRoutes = require('./admin.booth.route');
const adminPeriodRoutes = require('./admin.period.route');
const adminExportRoutes = require('./admin.export.route');
const adminThresholdRoutes = require('./admin.threshold.route');

router.use(verifyToken);
router.use(isAdmin);

router.use('/booths', adminBoothsRoutes);
router.use('/periods', adminPeriodRoutes);
router.use('/export', adminExportRoutes);
router.use('/', adminThresholdRoutes);

module.exports = router;
