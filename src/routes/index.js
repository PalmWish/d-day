const express = require('express');
const healthRoute = require('./health.route');
const { errorResponse } = require('../utils/response');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');
const boothRoutes = require('./Booths/AppBooths');
const msRoutes = require('./auth-ms.route')
const stampRoute = require('./stamp.route');
const adminRoute = require('./admin.route');
const router = express.Router();

router.use('/', healthRoute);

router.use('/booths', boothRoutes);

router.use('/auth', msRoutes)

router.use('/stamps', stampRoute)

router.use('./admin', adminRoute)

router.use((req, res) => {
	res.status(HTTP_STATUS_CODE.NOT_FOUND).json(
		errorResponse({
			message: 'Not found',
			details: `Route ${req.originalUrl} does not exist`,
			statusCode: HTTP_STATUS_CODE.NOT_FOUND,
		})
	);
});

router.use((err, req, res, next) => {
	const statusCode = err.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
	const message = err.message || 'Internal server error';

	res.status(statusCode).json(
		errorResponse({
			message,
			details: err.details || err.stack || null,
			statusCode,
		})
	);
});

module.exports = router;
