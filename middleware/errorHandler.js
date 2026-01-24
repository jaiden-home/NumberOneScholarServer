const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let status = err.status || 'error';
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Handle database connection errors
  if (err.message === 'Database connection is not available') {
    statusCode = 503;
    status = 'service_unavailable';
    message = 'Database service is currently unavailable. Please try again later.';
  }

  // Log error
  const logContext = {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
    user: req.user,
    stack: err.stack
  };

  if (err instanceof AppError) {
    logger.warn(message, logContext);
  } else {
    logger.error(message, logContext);
  }

  // Development vs Production error response
  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      status,
      message,
      errors,
      stack: err.stack,
      requestId: req.requestId
    });
  } else {
    // In production, don't expose stack trace
    res.status(statusCode).json({
      status,
      message: statusCode === 500 ? 'Internal Server Error' : message,
      errors,
      requestId: req.requestId
    });
  }
};

// 404 error handler
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};