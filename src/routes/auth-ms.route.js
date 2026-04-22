const express = require('express');
const authMsController = require('../controllers/auth-ms.controller.js');
const { verifyToken } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/microsoft', authMsController.loginWithMicrosoft);
router.get('/microsoft/callback', authMsController.microsoftCallback);

router.get('/profile', verifyToken, authMsController.getProfile);

router.post('/logout', verifyToken, authMsController.logout);

module.exports = router;