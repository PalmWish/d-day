const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');

const notFound = (req, res) => {
	res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
		code: HTTP_STATUS_CODE.NOT_FOUND,
		message: 'Not found',
	});
};

const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
	const message = err.message || 'Internal server error';

	res.status(statusCode).json({
		code: statusCode,
		message,
	});
};

module.exports = {
	notFound,
	errorHandler,
};
