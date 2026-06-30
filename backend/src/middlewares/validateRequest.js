const { validationResult } = require('express-validator');

/**
 * Advanced Request Validator using express-validator
 * Catches validation errors and formats them into a clean JSON response
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Advanced formatting: Group errors tightly by field name for the frontend
    const formattedErrors = {};
    errors.array().forEach(err => {
      // err.path contains the field name in express-validator v7+
      const field = err.path || err.param; 
      if (!formattedErrors[field]) {
        formattedErrors[field] = err.msg;
      }
    });

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed. Please check your inputs.',
      errors: formattedErrors,
      data: null
    });
  }
  
  next();
};

module.exports = validateRequest;
