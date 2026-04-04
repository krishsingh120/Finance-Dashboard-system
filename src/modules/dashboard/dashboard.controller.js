const dashboardService = require("./dashboard.service");
const asyncHandler = require("../../utils/asyncHandler");
const { successResponse } = require("../../utils/response");

class DashboardController {
  getSummary = asyncHandler(async (req, res) => {
    const data = await dashboardService.getSummary();
    return successResponse(res, 200, "Summary fetched successfully", data);
  });

  getCategoryWise = asyncHandler(async (req, res) => {
    const data = await dashboardService.getCategoryWise();
    return successResponse(
      res,
      200,
      "Category wise data fetched successfully",
      data,
    );
  });

  getMonthlyTrends = asyncHandler(async (req, res) => {
    const data = await dashboardService.getMonthlyTrends();
    return successResponse(
      res,
      200,
      "Monthly trends fetched successfully",
      data,
    );
  });

  getRecentActivity = asyncHandler(async (req, res) => {
    const data = await dashboardService.getRecentActivity();
    return successResponse(
      res,
      200,
      "Recent activity fetched successfully",
      data,
    );
  });
}

module.exports = new DashboardController();
