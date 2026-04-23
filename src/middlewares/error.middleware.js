const constants = require("../constants/message.constant.js")

const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');

const notFound = (req, res) => {
	res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
		code: HTTP_STATUS_CODE.NOT_FOUND,
		message: constants.ERROR_MESSAGE.NOT_FOUND,
	});
};

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
	const statusCode = err.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;

	res.status(statusCode).json({
        success: false,
        message: err.message || constants.ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
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
