const User = require("./user.model");

class UserRepository {
  async findAll() {
    return await User.find({ isDeleted: false }).select("-password");
  }

  async findById(id) {
    return await User.findOne({ _id: id, isDeleted: false }).select(
      "-password",
    );
  }

  async findByEmail(email) {
    return await User.findOne({ email, isDeleted: false }).select("+password");
  }

  async updateRole(id, role) {
    return await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");
  }

  async updateStatus(id, isActive) {
    return await User.findByIdAndUpdate(id, { isActive }, { new: true }).select(
      "-password",
    );
  }

  async softDelete(id) {
    return await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async create(data) {
    return await User.create(data);
  }
}

module.exports = new UserRepository();
