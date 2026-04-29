const express = require('express');
const eventpopController = require('../controllers/auth.eventpop.controller.js');
const { verifyToken } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/eventpop', eventpopController.loginWithEventpop);
router.get('/eventpop/callback', eventpopController.eventpopCallback);

router.get('/eventpop/profile', verifyToken, eventpopController.getProfile);

router.post('/eventpop/logout', verifyToken, eventpopController.logout);

module.exports = router;
