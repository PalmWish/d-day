const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/is.admin');
const adminBoothsRoutes = require('./admin.booth.route')
const adminPeriodRoutes = require('./admin.period.routes')
const adminAuth = [authMiddleware, isAdmin];

router.use(adminAuth)

router.use('/booths', adminBoothsRoutes);
router.use('/periods', adminPeriodRoutes)

module.exports = router;