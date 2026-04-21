const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware)
router.post('/', voteController.handleVote);

module.exports = router;