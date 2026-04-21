const microsoftRepo = require("../repositories/auth-ms-repository.js");
const jwt = require("jsonwebtoken");
const config = require('../config/config.js');

const microsoftLogin = async (authMSCode) => {
    let msToken, profile;

    try {
        msToken = await microsoftRepo.getAccessTokenFromCode(authMSCode);
    } catch (error) {
        const err = new Error("INVALID_AUTH_CODE");
        err.statusCode = 401;
        throw err;
    }

    try {
        profile = await microsoftRepo.getMicrosoftProfile(msToken);
    } catch (error) {
        const err = new Error("OAUTH_PROVIDER_ERROR");
        err.statusCode = 502;
        throw err;
    }
    
    if (!profile.mail.endsWith('@kmutt.ac.th')) {
        const err = new Error("UNSUPPORTED_EMAIL_DOMAIN");
        err.statusCode = 403;
        throw err;
    }
    
    const studentId = profile.onPremisesSamAccountName;
    // console.log(`SID: ${studentId}`);
    if (!studentId) {
        const err = new Error("STUDENT_ID_NOT_FOUND");
        err.statusCode = 400;
        throw err;
    }

    const yearPrefix = studentId.substring(0, 2);
    
    let role = 'GUEST';
    if (yearPrefix === '67' || yearPrefix === '68') {
        role = 'SIT_STUDENT';
    } else if (yearPrefix === '65' || yearPrefix === '66') {
        role = 'STUDENT';
    }

    const adminList = config.adminEmails || []; 
    if (adminList.includes(profile.mail)) {
        role = 'ADMIN';
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
        role: user.role
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