const {createLogger , transports, format} = require('winston');
const config = require('../../../config.json');
const DB_URL = process.env.MONGODB_URI || config.url_web;
require('winston-mongodb');

const userlogger = createLogger({
  transports: [
    new transports.MongoDB({
      db: DB_URL,
      level: 'info',
      options: {useUnifiedTopology: true},
      format: format.combine(format.timestamp(), format.json()),
      tryReconnect: true,
      collection: 'user-login-logs'
    })
  ]
});
const requestErrorLogger = createLogger({
  transports: [
    new transports.MongoDB({
      db: DB_URL,
      level: 'error',
      options: {useUnifiedTopology: true},
      format: format.combine(format.timestamp(), format.json()),
      tryReconnect: true,
      collection: 'request-error-logs'
    })
  ]
});

const userTasksLogger = createLogger({
  transports: [
    new transports.MongoDB({
      db: DB_URL,
      level: 'info',
      options: {useUnifiedTopology: true},
      format: format.combine(format.timestamp(),format.json(),format.metadata()),
      tryReconnect: true,
      collection: 'user-tasks-logs'
    })
  ]
});
module.exports = {
  userlogger,
  requestErrorLogger,
  userTasksLogger
};