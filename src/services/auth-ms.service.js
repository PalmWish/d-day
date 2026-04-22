const microsoftRepo = require("../repositories/auth-ms.repository.js");
const jwt = require("jsonwebtoken");
const config = require('../config/config.js');
const msgConstants = require("../constants/message.constant.js")
const roleConstants = require("../constants/role.constant.js")
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');
const { STUDENT_ID_PREFIX } = require("../constants/prefix.constant.js")
const userRepository = require("../repositories/user.repository.js")

const microsoftLogin = async (authMSCode) => {
    let msToken, profile;

    try {
        msToken = await microsoftRepo.getAccessTokenFromCode(authMSCode);
    } catch {
        const err = new Error(msgConstants.ERROR_MESSAGE.INVALID_AUTH_CODE);
        err.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
        throw err;
    }

    try {
        profile = await microsoftRepo.getMicrosoftProfile(msToken);
    } catch {
        const err = new Error(msgConstants.ERROR_MESSAGE.OAUTH_ERROR);
        err.statusCode = HTTP_STATUS_CODE.BAD_GATEWAY;
        throw err;
    }
    
    if (!profile.mail.endsWith('@kmutt.ac.th')) {
        const err = new Error(msgConstants.ERROR_MESSAGE.UNSUPPORTED_EMAIL);
        err.statusCode = HTTP_STATUS_CODE.FORBIDDEN;
        throw err;
    }
    
    const studentId = profile.onPremisesSamAccountName;
    // console.log(`SID: ${studentId}`);
    if (!studentId) {
        const err = new Error(msgConstants.ERROR_MESSAGE.STUDENT_NOT_FOUND);
        err.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
        throw err;
    }

    const yearPrefix = studentId.substring(0, 2);
    
    let role = roleConstants.ROLE.GUEST;
    if (yearPrefix === STUDENT_ID_PREFIX.FIRST_YEAR || yearPrefix === STUDENT_ID_PREFIX.SECOND_YEAR) {
        role = roleConstants.ROLE.SIT_STUDENT;
    } else if (yearPrefix === STUDENT_ID_PREFIX.THIRD_YEAR || yearPrefix === STUDENT_ID_PREFIX.FOURTH_YEAR) {
        role = roleConstants.ROLE.STUDENT;
    }

    const adminList = config.whiteList || []; 
    if (adminList.includes(profile.mail)) {
        role = roleConstants.ROLE.ADMIN;
    }

    let user = await userRepository.findByEmail(profile.mail);
    
    if (user) {
        if (user.role === roleConstants.ROLE.ADMIN) {
            role = roleConstants.ROLE.ADMIN;
        }
    } else {
        user = await userRepository.createUser({
            email: profile.mail,
            studentId: studentId,
            name: profile.displayName,
            role: role
        });
    }

    const payload = {
        userId: profile.id,
        email: profile.mail,
        studentId: studentId,
        name: profile.displayName,
        role: role
    };

    const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });

    return {
        accessToken,
        user: {
            userId: user.userId,
            email: user.email,
            studentId: user.studentId,
            name: user.name,
            role: user.role
        }
    };
}

module.exports = {
    microsoftLogin
};