const {createLogger , transports, format} = require('winston');
const config = require('../../../config.json');
require('winston-mongodb');

const userlogger = createLogger({
  transports: [
    new transports.MongoDB({
      db: config.url_local,
      level: 'info',
      options: {useUnifiedTopology: true},
      format: format.combine(format.timestamp(), format.json()),
      collection: 'user-login-logs'
    })
  ]
});
const requestErrorLogger = createLogger({
  transports: [
    new transports.MongoDB({
      db: config.url_local,
      level: 'error',
      options: {useUnifiedTopology: true},
      format: format.combine(format.timestamp(), format.json()),
      collection: 'request-error-logs'
    })
  ]
});

const userTasksLogger = createLogger({
  transports: [
    new transports.MongoDB({
      db: config.url_local,
      level: 'info',
      options: {useUnifiedTopology: true},
      format: format.combine(format.timestamp(),format.json(),format.metadata()),
      collection: 'user-tasks-logs'
    })
  ]
});
module.exports = {
  userlogger,
  requestErrorLogger,
  userTasksLogger
};