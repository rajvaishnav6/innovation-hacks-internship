// A small error class that carries an HTTP status code alongside the
// message, so every controller can just do `next(new AppError(...))`
// and the centralized error handler knows exactly how to respond.
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
