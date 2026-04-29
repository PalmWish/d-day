const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote.controller');
const { verifyToken } = require('../middlewares/auth.middleware.js');

router.use(verifyToken);

router.post('/', voteController.handleVote);
router.get('/me', voteController.getMyVote);

module.exports = router;
