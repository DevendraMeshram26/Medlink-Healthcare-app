/**
 * Async Handler Wrapper
 * Wraps asynchronous controller functions so we don't have to write
 * try/catch blocks manually in every single endpoint.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
