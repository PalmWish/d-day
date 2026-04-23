const express = require('express');
const router = express.Router();
const { getAllBooths, getBoothById } = require('../../controllers/boothController');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const { verifyToken } = require('../middlewares/auth.middleware.js');

router.use(verifyToken);
router.use((req, res, next) => {
	console.info('[booths.route] incoming request', {
		method: req.method,
		path: req.originalUrl,
	});
	next();
});

router.get('/', getAllBooths);
router.get('/:id', getBoothById);

module.exports = router;