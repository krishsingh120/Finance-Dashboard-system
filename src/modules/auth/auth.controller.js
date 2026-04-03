const authService = require("./auth.service");
const asyncHandler = require("../../utils/asyncHandler");
const { successResponse } = require("../../utils/response");

class AuthController {
  register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const data = await authService.register(name, email, password);
    return successResponse(res, 201, "User registered successfully", data);
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    return successResponse(res, 200, "Login successful", data);
  });

  refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const data = await authService.refresh(refreshToken);
    return successResponse(res, 200, "Token refreshed", data);
  });

  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const data = await authService.logout(refreshToken);
    return successResponse(res, 200, data.message);
  });
}

module.exports = new AuthController();
