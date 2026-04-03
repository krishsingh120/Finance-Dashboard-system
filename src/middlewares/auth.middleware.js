const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET } = require("../config/serverConfig");
const UnauthorizedError = require("../errors/unauthorized.error");
const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Access token required");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

  req.user = { id: decoded.id, role: decoded.role };
  next();
});

module.exports = authenticate;
