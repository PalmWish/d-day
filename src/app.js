const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const config = require('./config/config');
const routes = require('./routes/index');
const msRoutes = require('./routes/auth-ms-route')

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (config.env !== 'test') {
  app.use(morgan('dev'));
}

app.use(routes);
app.use('/api/auth', msRoutes)

module.exports = app;
