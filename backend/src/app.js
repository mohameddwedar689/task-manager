/**
 * Express application setup.
 *
 * Deliberately separate from server.js: this file builds and exports the
 * `app` object but never calls `.listen()`. That means test files can
 * `require('./app')` and pass it directly to supertest, hitting real
 * middleware and routes without opening a network port.
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');

const config = require('./config/env');
const logger = require('./config/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Route modules (added in later steps as we build auth/tasks)
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();

// --- Security middleware ---
app.use(helmet()); // sets safe HTTP headers (X-Content-Type-Options, etc.)
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(mongoSanitize()); // strips keys starting with '$' or containing '.' to prevent NoSQL injection

// --- Body parsing ---
app.use(express.json({ limit: '10kb' })); // small limit: this API doesn't need large payloads

// --- Logging ---
// morgan writes HTTP access logs through our winston logger's stream,
// so all logs (access + application) go through one pipeline.
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// --- Health check (useful for uptime monitors / deployment platforms) ---
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'OK', uptime: process.uptime() });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// --- 404 + centralized error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
