const AppError = require("./base.error");

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

module.exports = ForbiddenError;
