const httpStatus = require('http-status');

const notFound = (req, res) => {
	res.status(httpStatus.NOT_FOUND).json({
		code: httpStatus.NOT_FOUND,
		message: 'Not found',
	});
};

const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
	const message = err.message || httpStatus[statusCode];

	res.status(statusCode).json({
		code: statusCode,
		message,
	});
};

module.exports = {
	notFound,
	errorHandler,
};
