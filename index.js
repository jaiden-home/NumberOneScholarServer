const express = require('express');
const cors = require('cors');
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
app.use(cors());
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
    // Try to initialize database connection
    await db.initialize();
    logger.info('Database connection initialized successfully');
  } catch (error) {
    logger.warn('Failed to initialize database connection, starting server without database', error);
  }
  
  // Start server regardless of database connection status
  const port = config.server.port;
  app.listen(port, () => {
    logger.info(`Server running on port ${port}`, {
      port,
      environment: config.server.nodeEnv,
      databaseConnected: db.isConnected
    });
  });
};

// Start the app
initializeApp();

module.exports = app;