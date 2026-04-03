const AppError = require("./base.error");

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;
