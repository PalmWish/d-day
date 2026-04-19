const app = require('./app');
const config = require('./config/config');

const server = app.listen(config.port, () => {
  // Keep startup log compact and explicit for container logs.
  console.log(`${config.appName} listening on port ${config.port} (${config.env})`);
});

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
