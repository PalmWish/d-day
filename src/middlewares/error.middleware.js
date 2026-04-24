const constants = require('../constants/message.constant.js');

const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');
const { errorResponse } = require('../utils/response.js');

const notFound = (req, res) => {
    res.status(HTTP_STATUS_CODE.NOT_FOUND).json(
        errorResponse({
            message: constants.ERROR_MESSAGE.NOT_FOUND,
            details: 'Route not found',
            statusCode: HTTP_STATUS_CODE.NOT_FOUND,
        })
    );
};

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
	const statusCode = err.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json(
        errorResponse({
            message: err.message || constants.ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            details: err.details || 'Something went wrong on the server',
            statusCode,
        })
    );
};

module.exports = {
	notFound,
	errorHandler,
};
