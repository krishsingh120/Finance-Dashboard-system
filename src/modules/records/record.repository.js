const Record = require("./record.model");

class RecordRepository {
  async create(data) {
    return await Record.create(data);
  }

  async findAll(filters, skip, limit) {
    const query = { isDeleted: false, ...filters };

    const [records, total] = await Promise.all([
      Record.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email"),
      Record.countDocuments(query),
    ]);

    return { records, total };
  }

  async findById(id) {
    return await Record.findOne({ _id: id, isDeleted: false }).populate(
      "userId",
      "name email",
    );
  }

  async update(id, data) {
    return await Record.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async softDelete(id) {
    return await Record.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }
}

module.exports = new RecordRepository();
