const ForbiddenError = require("../errors/forbidden.error");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Role '${req.user.role}' is not allowed to perform this action`,
      );
    }
    next();
  };
};

module.exports = authorize;
