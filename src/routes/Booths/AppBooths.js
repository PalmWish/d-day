const express = require('express');
const router = express.Router();
const { getAllBooths } = require('../../controllers/boothController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getAllBooths);

module.exports = router;