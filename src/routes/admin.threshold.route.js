const express = require('express');
const adminController = require('../controllers/admin.threshold.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const router = express.Router();

router.use(verifyToken);
router.use(isAdmin);

router.get('/thresholds', adminController.getThresholds);

module.exports = router;
