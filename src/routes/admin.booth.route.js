const express = require('express');
const router = express.Router();
const adminBoothController = require('../controllers/admin.booth.controller');

router.get('/tracking', adminBoothController.getBoothsTracking);

module.exports = router;