const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote.controller');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware)
router.post('/', voteController.handleVote);
router.get('/me', voteController.getMyVote);
module.exports = router;