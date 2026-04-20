const express = require('express');
const healthRoute = require('./health.route');
const adminRoute = require('./admin.route');

const router = express.Router();

router.use('/', healthRoute);
router.use('/admin', adminRoute);

module.exports = router;
