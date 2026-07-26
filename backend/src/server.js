/**
 * Entry point. Responsibilities: connect to the database, then start
 * listening for HTTP requests. Also handles process-level safety nets
 * so an unexpected error crashes loudly instead of leaving a zombie process.
 */

const app = require('./app');
const config = require('./config/env');
const logger = require('./config/logger');
const { connectDB } = require('./config/database');

async function start() {
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.info(`Server running in ${config.env} mode on port ${config.port}`);
  });

  // Safety net: if a promise rejection is never caught anywhere, log it and
  // shut down gracefully rather than continuing in an unknown state.
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

start();
