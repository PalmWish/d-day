const express = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const router = express.Router();

const adminBoothsRoutes = require('./admin.booth.route');
const adminPeriodRoutes = require('./admin.period.route');
const adminExportRoutes = require('./admin.export.route');

router.use(verifyToken);
router.use(isAdmin);

router.use('/booths', adminBoothsRoutes);
router.use('/periods', adminPeriodRoutes);
router.use('/export', adminExportRoutes);

router.get('/thresholds', adminController.getThresholds);

module.exports = router;
