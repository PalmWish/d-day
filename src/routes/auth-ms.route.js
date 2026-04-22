const express = require('express');
const authMsController = require('../controllers/auth-ms.controller.js');
const middleware = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/microsoft', authMsController.loginWithMicrosoft);
router.get('/microsoft/callback', authMsController.microsoftCallback);

module.exports = router;