const AppError = require("./base.error");

class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}

module.exports = InternalServerError;
