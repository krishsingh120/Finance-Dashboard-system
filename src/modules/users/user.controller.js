const userService = require("./user.service");
const asyncHandler = require("../../utils/asyncHandler");
const { successResponse } = require("../../utils/response");

class UserController {
  getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    return successResponse(res, 200, "Users fetched successfully", users);
  });

  getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, 200, "User fetched successfully", user);
  });

  getMe = asyncHandler(async (req, res) => {
    const user = await userService.getMe(req.user.id);
    return successResponse(res, 200, "Profile fetched successfully", user);
  });

  updateRole = asyncHandler(async (req, res) => {
    const user = await userService.updateRole(req.params.id, req.body.role);
    return successResponse(res, 200, "Role updated successfully", user);
  });

  updateStatus = asyncHandler(async (req, res) => {
    const user = await userService.updateStatus(
      req.params.id,
      req.body.isActive,
    );
    return successResponse(res, 200, "Status updated successfully", user);
  });

  deleteUser = asyncHandler(async (req, res) => {
    const result = await userService.deleteUser(req.params.id, req.user.id);
    return successResponse(res, 200, result.message);
  });
}

module.exports = new UserController();
