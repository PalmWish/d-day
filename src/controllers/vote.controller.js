const voteService = require('../services/vote.service');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode');
const { successResponse, errorResponse } = require('../utils/response');

const handleVote = async (req, res, next) => {
  try {
    const { boothId } = req.body;
    if (!boothId) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(errorResponse({
  message:'boothId is required',
  details = null,
  statusCode = HTTP_STATUS_CODE.BAD_REQUEST,
  data = null,
}));
    }
 
    if (!req.user || !req.user.id) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse({
  message:'Invalid or missing token',
  details = null,
  statusCode = HTTP_STATUS_CODE.UNAUTHORIZED,
  data = null,
}));
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await voteService.processVote(userId, userRole, boothId);
    
    const statusCode = result.isNewRecord ? HTTP_STATUS_CODE.CREATED : HTTP_STATUS_CODE.OK;
    return res.status(statusCode).json(successResponse({
        message: result.isNewRecord ? 'Vote submitted successfully' : 'Vote updated successfully', 
        data: result.data,
        statusCode: statusCode
      }));

  } catch (error) {
    
    if (error.message === 'BOOTH_NOT_FOUND') {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(errorResponse({
  message:'BOOTHS_NOT_FOUND',
  details = null,
  statusCode = HTTP_STATUS_CODE.NOT_FOUND,
  data = null,
}));
    }
    
    if (error.message === 'VOTING_PERIOD_CLOSED') {
      return res.status(HTTP_STATUS_CODE.FORBIDDEN).json(errorResponse({
  message:'VOTING_PERIOD_CLOSED',
  details = null,
  statusCode = HTTP_STATUS_CODE.FORBIDDEN,
  data = null,
}));
    }
    
    if (error.message === 'INSUFFICIENT_STAMPS') {
      return res.status(HTTP_STATUS_CODE.FORBIDDEN).json(errorResponse({
  message:'INSUFFICIENT_STAMPS',
  details = null,
  statusCode = HTTP_STATUS_CODE.FORBIDDEN,
  data = null,
}));
    }

    if (error.message === 'MUST_STAMP_BEFORE_VOTE') {
      return res.status(HTTP_STATUS_CODE.FORBIDDEN).json(errorResponse({
  message:'MUST_STAMP_BEFORE_VOTE',
  details = null,
  statusCode = HTTP_STATUS_CODE.FORBIDDEN,
  data = null,
}));
    }

    console.error(error);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse({
  message:"INTERNAL_SERVER_ERROR",
  details = null,
  statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
  data = null,
}));
  }
};
const getMyVote = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(errorResponse({
  message:'Invalid or missing token',
  details = null,
  statusCode = HTTP_STATUS_CODE.UNAUTHORIZED,
  data = null,
}));
    }
    const userId = req.user.id;
    const voteData = await voteService.getMyVote(userId);

    return res.status(HTTP_STATUS_CODE.OK).json(successResponse({
        message: "Successfully gets the vote",
        data: voteData,
        statusCode: HTTP_STATUS_CODE.OK
      }));
    
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse({
  message:"INTERNAL_SERVER_ERROR",
  details = null,
  statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
  data = null,
}));
  }
};

module.exports = { handleVote, getMyVote };