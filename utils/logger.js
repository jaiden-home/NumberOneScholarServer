const winston = require('winston');
const config = require('../config');

// Create logger instance
const logger = winston.createLogger({
  level: config.log.level,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'number-one-scholar-server'
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Middleware to add request ID to logger
logger.addRequestId = (req, res, next) => {
  req.requestId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  res.locals.requestId = req.requestId;
  next();
};

// Logger with request context
logger.withContext = (context) => {
  return {
    info: (message, meta) => logger.info(message, { ...context, ...meta }),
    warn: (message, meta) => logger.warn(message, { ...context, ...meta }),
    error: (message, meta) => logger.error(message, { ...context, ...meta }),
    debug: (message, meta) => logger.debug(message, { ...context, ...meta })
  };
};

module.exports = logger;