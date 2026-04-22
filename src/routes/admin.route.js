const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const adminBoothsRoutes = require('./admin.booth.route')
const adminAuth = [authMiddleware, isAdmin];

router.use(adminAuth)

router.use('/booths', adminBoothsRoutes);


module.exports = router;