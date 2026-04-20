const express = require('express');
const router = express.Router();
const { getAllBooths, getBoothById } = require('../../controllers/boothController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getAllBooths);
router.get('/:id', authMiddleware, getBoothById);

module.exports = router;