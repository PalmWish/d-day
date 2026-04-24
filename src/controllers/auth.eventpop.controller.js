const { URLSearchParams } = require('url');

const config = require('../config/config.js');
const eventpopService = require('../services/auth.eventpop.service.js');
const msgConstants = require('../constants/message.constant.js');
const { AUTH_CONSTANTS } = require('../constants/auth.constant.js');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');
const { successResponse, errorResponse } = require('../utils/response.js');
const userService = require('../services/user.service.js');

const loginWithEventpop = async (req, res) => {
  const queryParams = new URLSearchParams({
    client_id: config.eventpop.clientId,
    redirect_uri: config.eventpop.callbackUrl,
    response_type: AUTH_CONSTANTS.OAUTH_RESPONSE_TYPE_CODE,
  });

  const authUrl = `${config.eventpop.authEndpoint}?${queryParams.toString()}`;
  return res.redirect(authUrl);
};

const eventpopCallback = async (req, res, next) => {
  try {
    const authCode = req.query[AUTH_CONSTANTS.QUERY_PARAM_AUTH_CODE];

    if (!authCode) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
        errorResponse({
          message: msgConstants.ERROR_MESSAGE.INVALID_AUTH_CODE,
          details: 'No authorization code provided from Eventpop',
          statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
        })
      );
    }

    const authRes = await eventpopService.eventpopLogin(authCode);
    const { accessToken } = authRes;
    res.cookie(AUTH_CONSTANTS.AUTH_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      sameSite: AUTH_CONSTANTS.COOKIE_SAME_SITE_LAX,
      maxAge: AUTH_CONSTANTS.ONE_DAY_IN_MS,
    });
    console.log('eventpop login success');

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: '',
        data: accessToken,
        statusCode: HTTP_STATUS_CODE.OK,
      })
    );
  } catch (err) {
    console.log("has error");
    
    return next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const email = req.user?.email;

    if (!email) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
        errorResponse({
          message: msgConstants.ERROR_MESSAGE.INVALID_TOKEN,
          details: 'Token payload does not contain a valid user email',
          statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
        })
      );
    }

    const userProfile = await userService.getUserProfileByEmail(email);

    if (!userProfile) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(
        errorResponse({
          message: msgConstants.ERROR_MESSAGE.USER_NOT_FOUND,
          details: 'User profile does not exist or has been deleted',
          statusCode: HTTP_STATUS_CODE.NOT_FOUND,
        })
      );
    }

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'User profile retrieved successfully',
        data: userProfile,
        statusCode: HTTP_STATUS_CODE.OK,
      })
    );
  } catch (err) {
    return next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie(AUTH_CONSTANTS.AUTH_TOKEN_COOKIE_NAME);

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'Logged out successfully',
        data: null,
        statusCode: HTTP_STATUS_CODE.OK,
      })
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  loginWithEventpop,
  eventpopCallback,
  getProfile,
  logout,
};
