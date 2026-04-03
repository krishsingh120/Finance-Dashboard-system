const jwt = require("jsonwebtoken");
const authRepository = require("./auth.repository");
const { getRedisClient } = require("../../config/redisConfig");
const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} = require("../../config/serverConfig");
const BadRequestError = require("../../errors/badRequest.error");
const UnauthorizedError = require("../../errors/unauthorized.error");

class AuthService {
  generateAccessToken(payload) {
    return jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
  }

  async register(name, email, password) {
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) throw new BadRequestError("Email already registered");

    const user = await authRepository.createUser({ name, email, password });

    const payload = { id: user._id, role: user.role };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email, password) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid email or password");

    if (!user.isActive) throw new UnauthorizedError("Account is deactivated");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new UnauthorizedError("Invalid email or password");

    const payload = { id: user._id, role: user.role };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new UnauthorizedError("Refresh token required");

    // Redis mein blacklisted hai?
    const redis = getRedisClient();
    const isBlacklisted = await redis.get(`blacklist:${refreshToken}`);
    if (isBlacklisted) throw new UnauthorizedError("Token has been revoked");

    // verify karo
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // user exist karta hai?
    const user = await authRepository.findById(decoded.id);
    if (!user || !user.isActive)
      throw new UnauthorizedError("User not found or deactivated");

    const payload = { id: user._id, role: user.role };
    const newAccessToken = this.generateAccessToken(payload);

    return { accessToken: newAccessToken };
  }

  async logout(refreshToken) {
    if (!refreshToken) throw new BadRequestError("Refresh token required");

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // Redis mein blacklist karo — TTL = token ki remaining expiry
    const redis = getRedisClient();
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await redis.setex(`blacklist:${refreshToken}`, ttl, "blacklisted");
    }

    return { message: "Logged out successfully" };
  }
}

module.exports = new AuthService();
