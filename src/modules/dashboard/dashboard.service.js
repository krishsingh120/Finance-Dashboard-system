const dashboardRepository = require("./dashboard.repository");

class DashboardService {
  async getSummary() {
    const result = await dashboardRepository.getSummary();

    // aggregate result ko readable format mein convert karo
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      totalRecords: 0,
    };

    result.forEach((item) => {
      if (item._id === "income") {
        summary.totalIncome = item.total;
        summary.totalRecords += item.count;
      }
      if (item._id === "expense") {
        summary.totalExpense = item.total;
        summary.totalRecords += item.count;
      }
    });

    summary.netBalance = summary.totalIncome - summary.totalExpense;
    return summary;
  }

  async getCategoryWise() {
    const result = await dashboardRepository.getCategoryWise();

    // category wise group karo
    const categories = {};

    result.forEach((item) => {
      const { category, type } = item._id;
      if (!categories[category]) {
        categories[category] = { category, income: 0, expense: 0, total: 0 };
      }
      if (type === "income") categories[category].income += item.total;
      if (type === "expense") categories[category].expense += item.total;
      categories[category].total =
        categories[category].income - categories[category].expense;
    });

    return Object.values(categories).sort((a, b) => b.income - a.income);
  }

  async getMonthlyTrends() {
    const result = await dashboardRepository.getMonthlyTrends();

    // month wise group karo
    const months = {};

    result.forEach((item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      if (!months[key]) {
        months[key] = { month: key, income: 0, expense: 0, net: 0 };
      }
      if (item._id.type === "income") months[key].income += item.total;
      if (item._id.type === "expense") months[key].expense += item.total;
      months[key].net = months[key].income - months[key].expense;
    });

    return Object.values(months).sort((a, b) => b.month.localeCompare(a.month));
  }

  async getRecentActivity() {
    return await dashboardRepository.getRecentActivity(10);
  }
}

module.exports = new DashboardService();
