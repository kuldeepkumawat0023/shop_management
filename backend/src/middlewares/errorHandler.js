const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Strictly use 400 or the status code if it's explicitly set by apiError
  const statusCode = err.statusCode || 400; 

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
