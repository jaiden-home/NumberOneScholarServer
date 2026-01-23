const express = require('express');
const config = require('./config');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const db = require('./data/mysql/db');

// Import routes
const userRoutes = require('./routes/userRoutes');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger.addRequestId);

// Routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Initialize database connection
const initializeApp = async () => {
  try {
    await db.initialize();
    
    // Start server
    const port = config.server.port;
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`, {
        port,
        environment: config.server.nodeEnv
      });
    });
  } catch (error) {
    logger.error('Failed to initialize app', error);
    process.exit(1);
  }
};

// Start the app
initializeApp();

module.exports = app;