const microsoftRepo = require('../repositories/auth-ms.repository.js');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const msgConstants = require('../constants/message.constant.js');
const roleConstants = require('../constants/role.constant.js');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');
const { STUDENT_ID_PREFIX } = require('../constants/prefix.constant.js');
const userRepository = require('../repositories/user.repository.js');

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getMicrosoftAccessToken = async (authMSCode) => {
  try {
    const token = await microsoftRepo.getAccessTokenFromCode(authMSCode);
    console.info('[auth-ms.service] access token fetched from Microsoft');
    return token;
  } catch {
    console.warn('[auth-ms.service] invalid auth code from Microsoft');
    throw createError(
      msgConstants.ERROR_MESSAGE.INVALID_AUTH_CODE,
      HTTP_STATUS_CODE.UNAUTHORIZED
    );
  }
};

const getMicrosoftProfile = async (msToken) => {
  try {
    const profile = await microsoftRepo.getMicrosoftProfile(msToken);
    console.info('[auth-ms.service] Microsoft profile fetched', {
      email: profile?.mail || null,
    });
    return profile;
  } catch {
    console.warn('[auth-ms.service] failed to fetch Microsoft profile');
    throw createError(
      msgConstants.ERROR_MESSAGE.OAUTH_ERROR,
      HTTP_STATUS_CODE.BAD_GATEWAY
    );
  }
};

const resolveRole = (studentId, email) => {
  const yearPrefix = studentId.substring(0, 2);
  let role = roleConstants.ROLE.GUEST;

  if (
    [STUDENT_ID_PREFIX.FIRST_YEAR, STUDENT_ID_PREFIX.SECOND_YEAR].includes(
      yearPrefix
    )
  ) {
    role = roleConstants.ROLE.SIT_STUDENT;
  } else if (
    [STUDENT_ID_PREFIX.THIRD_YEAR, STUDENT_ID_PREFIX.FOURTH_YEAR].includes(
      yearPrefix
    )
  ) {
    role = roleConstants.ROLE.STUDENT;
  }

  if ((config.whiteList || []).includes(email)) {
    return roleConstants.ROLE.ADMIN;
  }

  return role;
};

const microsoftLogin = async (authMSCode) => {
  console.info('[auth-ms.service] microsoftLogin start', {
    hasAuthCode: Boolean(authMSCode),
  });

  const msToken = await getMicrosoftAccessToken(authMSCode);
  const profile = await getMicrosoftProfile(msToken);
  const email = profile.mail;
  const studentId = profile.onPremisesSamAccountName;
  const name = profile.displayName;

  if (!email?.endsWith('@kmutt.ac.th')) {
    console.warn('[auth-ms.service] unsupported email domain', {
      email,
    });
    throw createError(
      msgConstants.ERROR_MESSAGE.UNSUPPORTED_EMAIL,
      HTTP_STATUS_CODE.FORBIDDEN
    );
  }

  if (!studentId) {
    console.warn('[auth-ms.service] studentId not found in profile', {
      email,
    });
    throw createError(
      msgConstants.ERROR_MESSAGE.STUDENT_NOT_FOUND,
      HTTP_STATUS_CODE.BAD_REQUEST
    );
  }

  let role = resolveRole(studentId, email);
  console.info('[auth-ms.service] role resolved', {
    email,
    role,
  });

  let user = await userRepository.findByEmail(email);
  if (user) {
    console.info('[auth-ms.service] existing user found', {
      userId: user.id,
      role: user.role,
    });
    if (user.role === roleConstants.ROLE.ADMIN) {
      role = roleConstants.ROLE.ADMIN;
    }
  } else {
    console.info('[auth-ms.service] creating new user', {
      email,
      role,
    });
    user = await userRepository.createUser({
      email,
      studentId,
      name,
      role,
    });
  }

  const payload = {
    userId: user.id,
    email,
    studentId,
    name,
    role,
  };

  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });
  console.info('[auth-ms.service] jwt generated', {
    userId: user.id,
    role,
  });

  return {
    accessToken,
    user: {
      userId: user.id,
      email: user.email,
      studentId: user.studentId,
      name: user.name,
      role: user.role,
    },
  };
};

const mockLogin = async () => {
  const mockUser = {
    email: 'test@example.com',
    studentId: '66130500038',
    name: 'Test User',
    role: roleConstants.ROLE.STUDENT,
  };

  let user = await userRepository.findByEmail(mockUser.email);

  if (!user) {
    user = await userRepository.createUser({
      email: mockUser.email,
      studentId: mockUser.studentId,
      name: mockUser.name,
      role: mockUser.role,
    });
  }

  const payload = {
    userId: user.id,
    email: mockUser.email,
    studentId: mockUser.studentId,
    name: mockUser.name,
    role: mockUser.role,
  };

  const accessToken = await jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });

  return accessToken;
};

module.exports = {
  microsoftLogin,
  mockLogin,
};
