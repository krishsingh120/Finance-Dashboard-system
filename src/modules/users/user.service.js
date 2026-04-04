const userRepository = require("./user.repository");
const NotFoundError = require("../../errors/notFound.error");
const BadRequestError = require("../../errors/badRequest.error");

class UserService {
  async getAllUsers() {
    return await userRepository.findAll();
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async getMe(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async updateRole(id, role) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");

    const updated = await userRepository.updateRole(id, role);
    return updated;
  }

  async updateStatus(id, isActive) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");

    const updated = await userRepository.updateStatus(id, isActive);
    return updated;
  }

  async deleteUser(id, requestingUserId) {
    if (id === requestingUserId.toString()) {
      throw new BadRequestError("You cannot delete your own account");
    }

    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");

    await userRepository.softDelete(id);
    return { message: "User deleted successfully" };
  }
}

module.exports = new UserService();
