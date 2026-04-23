const express = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();
const adminBoothsRoutes = require('./admin.booth.route');
const adminPeriodRoutes = require('./admin.period.route');
const adminExportRoutes = require('./admin.export.route');

router.use(verifyToken);

router.use('/booths', adminBoothsRoutes);
router.use('/periods', adminPeriodRoutes);
router.use('/export', isAdmin, adminExportRoutes);

router.get('/thresholds', isAdmin, adminController.getThresholds);

module.exports = router;
