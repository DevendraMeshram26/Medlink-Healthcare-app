/**
 * Global Error Handler Middleware
 * Catches all errors thrown in the application and formats them consistently.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    status: false,
    message: err.message || "Internal Server Error",
    // Only send stack traces in development mode for security
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
