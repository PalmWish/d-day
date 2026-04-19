const app = require('./app');
const config = require('./config/config');

app.listen(config.port, () => {
  console.log(`${config.appName} listening on port ${config.port} (${config.env})`);
});