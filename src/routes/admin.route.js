const express = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/is.admin');
const adminBoothsRoutes = require('./admin.booth.route')
const adminPeriodRoutes = require('./admin.period.route')
const adminExportRoutes = require('./admin.export.route')
const adminAuth = [authMiddleware, isAdmin];
const { verifyToken } = require('../middlewares/auth.middleware.js');

router.use(verifyToken);

router.use('/booths', adminBoothsRoutes);
router.use('/periods',adminPeriodRoutes)
router.use('/export',isAdmin, adminExportRoutes)
 

router.get('/thresholds', verifyToken, isAdmin, adminController.getThresholds);

module.exports = router;
