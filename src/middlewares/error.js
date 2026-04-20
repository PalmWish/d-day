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
        success: false,
        message: err.message || "Internal Server Error",
        data: null,
        statusCode: statusCode,
        error: {
            details: err.details || "Something went wrong on the server"
        }
    });
};

module.exports = {
	notFound,
	errorHandler,
};
