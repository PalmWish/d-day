const express = require('express');
const router = express.Router();
const { getAllBooths, getBoothById } = require('../../controllers/boothController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware)

router.get('/', getAllBooths);
router.get('/:id', getBoothById);

module.exports = router;