/**
 * Winston logger.
 *
 * Why not just console.log?
 * - Log levels (error/warn/info/debug) let us filter noise in production.
 * - Structured, timestamped output is easier to pipe into log aggregators later
 *   (CloudWatch, Datadog, etc.) without changing application code.
 */

const winston = require('winston');
const config = require('./env');

const logger = winston.createLogger({
  level: config.isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    config.isProduction
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, stack }) => {
            return `${timestamp} [${level}]: ${stack || message}`;
          })
        )
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
