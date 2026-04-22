const stampService = require('../services/stamp.service.js');
const { successResponse, errorResponse } = require('../utils/response.js');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');
const { ERROR_MESSAGE } = require('../constants/message.constant.js');

const getStampCount = async (req, res) => {
    try {
        const { userId, role } = req.user;

        const stampData = await stampService.getStampCount(userId, role);

        return res.status(HTTP_STATUS_CODE.OK).json(
            successResponse({
                message: "Stamp count retrieved successfully",
                data: stampData,
                statusCode: HTTP_STATUS_CODE.OK
            })
        );

    } catch (err) {
        console.error("getStampCount controller:", err);
        next(err)
    }
};

module.exports = {
    getStampCount
};