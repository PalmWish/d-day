const express = require('express');
const healthRoute = require('./health.route');
const boothRoutes = require('./booth.route');
const msRoutes = require('./auth-ms.route');
const stampRoute = require('./stamp.route');
const voteRoutes = require('./vote.route');
const adminRoutes = require('./admin.route');
const router = express.Router();

router.use('/', healthRoute);

router.use('/booths', boothRoutes);

router.use('/votes', voteRoutes);

router.use('/admin', adminRoutes);

router.use('/auth', msRoutes);

router.use('/stamps', stampRoute);

module.exports = router;
