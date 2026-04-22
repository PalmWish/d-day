const express = require('express');
const stampController = require('../controllers/stamp.controller.js');
const { verifyToken } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/count', verifyToken, stampController.getStampCount);

module.exports = router;