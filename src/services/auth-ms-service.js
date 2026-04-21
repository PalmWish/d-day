const microsoftRepo = require("../repositories/auth-ms-repository.js");
const jwt = require("jsonwebtoken");
const config = require('../config/config.js');
const msgConstants = require("../constants/message.constant.js")
const roleConstants = require("../constants/role.constant.js")

const microsoftLogin = async (authMSCode) => {
    let msToken, profile;

    try {
        msToken = await microsoftRepo.getAccessTokenFromCode(authMSCode);
    } catch (error) {
        const err = new Error(msgConstants.MESSAGE.INVALID_AUTH_CODE);
        err.statusCode = 401;
        throw err;
    }

    try {
        profile = await microsoftRepo.getMicrosoftProfile(msToken);
    } catch (error) {
        const err = new Error(msgConstants.MESSAGE.OAUTH_ERROR);
        err.statusCode = 502;
        throw err;
    }
    
    if (!profile.mail.endsWith('@kmutt.ac.th')) {
        const err = new Error(msgConstants.MESSAGE.UNSUPPORTED_EMAIL);
        err.statusCode = 403;
        throw err;
    }
    
    const studentId = profile.onPremisesSamAccountName;
    // console.log(`SID: ${studentId}`);
    if (!studentId) {
        const err = new Error(msgConstants.MESSAGE.STUDENT_NOT_FOUND);
        err.statusCode = 400;
        throw err;
    }

    const yearPrefix = studentId.substring(0, 2);
    
    let role = roleConstants.ROLE.GUEST;
    if (yearPrefix === '67' || yearPrefix === '68') {
        role = roleConstants.ROLE.SIT_STUDENT;
    } else if (yearPrefix === '65' || yearPrefix === '66') {
        role = roleConstants.ROLE.STUDENT;
    }

    const adminList = config.whiteList || []; 
    if (adminList.includes(profile.mail)) {
        role = roleConstants.ROLE.ADMIN;
    }

    // ผม test เฉยๆคับอันนี้
    let user = { userId: 1, email: profile.mail, studentId: studentId, name: profile.displayName, role: role };

    // อันนี้ของจริงแต่เดี๋ยว test อีกทีครับ
    // let user = await userRepository.findByEmail(profile.mail);
    
    // if (user) {
    //     if (user.role === 'ADMIN') {
    //         role = 'ADMIN';
    //     }
    // } else {
    //     user = await userRepository.createUser({
    //         email: profile.mail,
    //         studentId: studentId,
    //         name: profile.displayName,
    //         role: role
    //     });
    // }

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