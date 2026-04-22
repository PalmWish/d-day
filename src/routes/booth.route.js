const express = require('express');
const router = express.Router();
const { getAllBooths, getBoothById } = require('../controllers/booth.controller');
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware)

router.get('/', getAllBooths);
router.get('/:id', getBoothById);

module.exports = router;