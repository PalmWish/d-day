const microsoftRepo = require("../repositories/auth-ms-repository.js");
const jwt = require("jsonwebtoken");
const config = require('../config/config.js');

const microsoftLogin = async (authMSCode) => {
    const msToken = await microsoftRepo.getAccessTokenFromCode(authMSCode);
    const profile = await microsoftRepo.getMicrosoftProfile(msToken);
    // console.log(profile);
    
    if (!profile.mail.endsWith('@kmutt.ac.th')) {
        const err = new Error("UNSUPPORTED_EMAIL_DOMAIN");
        err.statusCode = 403;
        throw err;
    }
    
    const studentId = profile.onPremisesSamAccountName;
    // console.log(`SID: ${studentId}`);
    if (!studentId) {
        throw new Error("STUDENT_ID_NOT_FOUND");
    }

    const yearPrefix = studentId.substring(0, 2);
    
    let role = 'GUEST';
    if (yearPrefix === '67' || yearPrefix === '68') {
        role = 'SIT_STUDENT';
    } else if (yearPrefix === '65' || yearPrefix === '66') {
        role = 'STUDENT';
    }

    // โค้ดส่วน check email whitelist ของ admin (เดี๋ยวมาเพิ่ม)

    // ผม test เฉยๆคับอันนี้
    let user = { userId: 1, email: profile.mail, studentId: studentId, name: profile.displayName, role: role };

    // อันนี้ของจริงแต่เดี๋ยว test อีกทีครับ
    // let user = await userRepository.findByEmail(profile.mail);
    // if (!user) {
    //     user = await userRepository.create({ email: profile.mail, studentId: studentId, name: profile.displayName, role: role });
    // } else {
    //     await userRepository.updateLastLogin(user.id);
    // }

    const payload = {
        userId: profile.id,
        email: profile.mail,
        studentId: studentId,
        name: profile.displayName,
        role: user.role
    };

    const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });

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