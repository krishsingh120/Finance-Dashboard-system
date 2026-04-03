const User = require("../users/user.model");

class AuthRepository {
  async createUser(data) {
    return await User.create(data);
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select("+password");
  }

  async findById(id) {
    return await User.findById(id);
  }
}

module.exports = new AuthRepository();
