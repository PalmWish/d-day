const express = require('express');
const router = express.Router();
const { getAllBooths, getBoothById } = require('../../controllers/boothController');
const { authMiddleware } = require('../../middlewares/auth.middleware');

router.use((req, res, next) => {
	console.info('[booths.route] incoming request', {
		method: req.method,
		path: req.originalUrl,
	});
	next();
});

router.use(authMiddleware);

router.get('/', getAllBooths);
router.get('/:id', getBoothById);

module.exports = router;