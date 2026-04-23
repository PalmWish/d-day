const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const config = require('./config/config');
const routes = require('./routes/index');

const app = express();

const { errorHandler, notFound } = require('./middlewares/error.middleware');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (config.env !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
