const config = require('../config/config.js');
const authMsService = require('../services/auth-ms.service.js');
const msgConstants = require('../constants/message.constant.js');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');
const { successResponse, errorResponse } = require('../utils/response.js');
const userService = require('../services/user.service.js');

const loginWithMicrosoft = async (req, res) => {
  // const authUrl = `${config.microsoft.authEndpoint}?client_id=${config.microsoft.clientId}&response_type=code&redirect_uri=${config.microsoft.redirectUri}&response_mode=query&scope=User.Read`;

  // res.redirect(authUrl);

  const accessToken = await authMsService.mockLogin();

  console.log('Mock Access Token:', accessToken); 

  res.status(HTTP_STATUS_CODE.OK).json(
    successResponse({
      message: '',
      data: accessToken,
      statusCode: HTTP_STATUS_CODE.OK,
    })
  );
};

const microsoftCallback = async (req, res) => {
  try {
    const authCode = req.query.code;
    // console.info('[auth-ms.controller] microsoftCallback start', {
    //   hasAuthCode: Boolean(authCode),
    // });

    if (!authCode) {
      // console.warn('[auth-ms.controller] missing microsoft auth code');
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
        errorResponse({
          message: msgConstants.ERROR_MESSAGE.INVALID_AUTH_CODE,
          details: 'No authorization code provided from Microsoft',
          statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
        })
      );
    }
    // console.log("Auth Code Received:", authCode);

    const authRes = await authMsService.microsoftLogin(authCode);
    const { accessToken } = authRes;
    // console.info('[auth-ms.controller] microsoftCallback token issued', {
    //   userId: authRes.user?.userId || null,
    //   role: authRes.user?.role || null,
    // });

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === config.PRODUCTION,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: '',
        data: accessToken,
        statusCode: HTTP_STATUS_CODE.OK,
      })
    );

    // res.redirect(`${config.frontendUrl}/`);
  } catch (err) {
    // console.error('[auth-ms.controller] microsoftCallback failed', {
    //   error: err.message,
    //   stack: err.stack,
    // });
    res.redirect(
      `${config.frontendUrl}/?error=${encodeURIComponent(err.message)}`
    );
  }
};

const getProfile = async (req, res, next) => {
  try {
    const email = req.user?.email;
    // console.info('[auth-ms.controller] getProfile start', { userId });

    if (!email) {
      // console.warn(
      //   '[auth-ms.controller] getProfile missing user id in token payload'
      // );
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(
        errorResponse({
          message: msgConstants.ERROR_MESSAGE.INVALID_TOKEN,
          details: 'Token payload does not contain a valid user id',
          statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
        })
      );
    }

    const userProfile = await userService.getUserProfileByEmail(email);

    if (!userProfile) {
      // console.warn('[auth-ms.controller] getProfile user not found', { email });
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(
        errorResponse({
          message: msgConstants.ERROR_MESSAGE.USER_NOT_FOUND,
          details: 'User profile does not exist or has been deleted',
          statusCode: HTTP_STATUS_CODE.NOT_FOUND,
        })
      );
    }
    // console.info('[auth-ms.controller] getProfile success', { userId });
    // console.info('[auth-ms.controller] getProfile success', { email });

    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'User profile retrieved successfully',
        data: userProfile,
        statusCode: HTTP_STATUS_CODE.OK,
      })
    );
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    // console.info('[auth-ms.controller] logout start', {
    //   userId: req.user?.userId || req.user?.id || null,
    // });

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === config.PRODUCTION,
      sameSite: 'lax',
      path: '/',
    });

    // console.info('[auth-ms.controller] logout success');
    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse({
        message: 'Logged out successfully',
        data: null,
        statusCode: HTTP_STATUS_CODE.OK,
      })
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  loginWithMicrosoft,
  microsoftCallback,
  getProfile,
  logout,
};
