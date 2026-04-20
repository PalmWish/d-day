const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config/config');
const routes = require('./routes/index');

const boothRoutes = require('./routes/Booths/AppBooths');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.env !== 'test') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.json({
    message: `Welcome to ${config.appName}`,
    env: config.env,
  });
});

app.use(config.apiPrefix, v1Routes);

app.use('/booths', boothRoutes);

app.use(notFound);
app.use(errorHandler);
app.use(routes);

module.exports = app;
