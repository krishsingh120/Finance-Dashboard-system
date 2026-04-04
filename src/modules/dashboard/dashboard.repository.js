const Record = require("../records/record.model");

class DashboardRepository {
  async getSummary() {
    return await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async getCategoryWise() {
    return await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);
  }

  async getMonthlyTrends() {
    return await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 24 }, // last 12 months × 2 types
    ]);
  }

  async getRecentActivity(limit = 10) {
    return await Record.find({ isDeleted: false })
      .sort({ date: -1 })
      .limit(limit)
      .populate("userId", "name email");
  }
}

module.exports = new DashboardRepository();
