class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // operational vs programming error distinguish
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
