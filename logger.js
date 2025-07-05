// logger.js

// const { createLogger, format, transports } = require('winston');
import { createLogger, format, transports } from 'winston';
// const path = require('path');
// import path from 'path';

const { combine, timestamp, printf, colorize, errors } = format;


// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create a Winston logger
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // log stack traces
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new transports.File({
      filename: 'error.log',
      level: 'error',
    }),
    new transports.File({
      filename: 'app.log',
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log' }),
  ],
});

// module.exports = logger;
export default logger;
