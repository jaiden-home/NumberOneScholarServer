const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

// Validation error handler middleware
const validate = (schemas) => {
  return async (req, res, next) => {
    // Run all validation schemas
    await Promise.all(
      schemas.map(schema => schema.run(req))
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }));

      return next(new ValidationError('Validation failed', formattedErrors));
    }

    next();
  };
};

module.exports = {
  validate
};