const stampService = require('../services/stamp.service.js');
const { successResponse } = require('../utils/response.js');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');

const getStampCount = async (req, res, next) => {
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
        next(err);
    }
};

module.exports = {
    getStampCount
};