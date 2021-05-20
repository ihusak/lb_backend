const {createLogger , transports, format} = require('winston');
const config = require('../../../config.json');
const DB_URL = config.url_web;
require('winston-mongodb');

const createLoggerForNode = createLogger({
  transports: [
    new transports.Console({
      'colorize': true
    })
  ]
});

const errorLogger = createLoggerForNode;


const userLoginlogger = createLogger({
  transports: [
    new transports.MongoDB({
      db: DB_URL,
      level: 'info',
      options: {useUnifiedTopology: true},
      format: format.combine(format.timestamp(), format.json(),format.metadata()),
      tryReconnect: true,
      collection: 'user-login-logs'
    })
  ]
});
const userLogoutlogger = createLogger({
  transports: [
    new transports.MongoDB({
      db: DB_URL,
      level: 'info',
      options: {useUnifiedTopology: true},
      format: format.combine(format.timestamp(), format.json(),format.metadata()),
      tryReconnect: true,
      collection: 'user-logout-logs'
    })
  ]
});
const requestErrorLogger = createLogger({
  transports: [
    new transports.MongoDB({
      db: DB_URL,
      level: 'error',
      options: {useUnifiedTopology: true},
      format: format.combine(format.timestamp(), format.json(),format.metadata()),
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

const userInfoUpdateLogger = createLogger({
  transports: [
    new transports.MongoDB({
      db: DB_URL,
      level: 'info',
      options: {useUnifiedTopology: true},
      format: format.combine(format.timestamp(),format.json(),format.metadata()),
      tryReconnect: true,
      collection: 'userInfo-update-logs'
    })
  ]
});

const mailTransporterLogger = createLogger({
  transports: [
    new transports.MongoDB({
      db: DB_URL,
      level: 'info',
      options: {useUnifiedTopology: true},
      format: format.combine(format.timestamp(),format.json(),format.metadata()),
      tryReconnect: true,
      collection: 'mail-transporter-logs'
    })
  ]
});
errorLogger.add(new transports.File({ filename: 'logfile.log' }), {
  'name': 'error-file',
  'level': 'error',
  'filename': './logs/error.log',
  'json': false,
  'datePattern': 'yyyy-MM-dd-',
  'prepend': true
});
module.exports = {
  userLoginlogger,
  requestErrorLogger,
  userTasksLogger,
  userLogoutlogger,
  userInfoUpdateLogger,
  mailTransporterLogger,
  errorLogger
};