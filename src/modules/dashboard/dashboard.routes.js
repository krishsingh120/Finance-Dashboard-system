const { Router } = require("express");
const dashboardController = require("./dashboard.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/rbac.middleware");

const router = Router();

router.use(authenticate);

// viewer → summary + recent only
router.get(
  "/summary",
  authorize("admin", "analyst", "viewer"),
  dashboardController.getSummary,
);
router.get(
  "/recent",
  authorize("admin", "analyst", "viewer"),
  dashboardController.getRecentActivity,
);

// analyst + admin → full access
router.get(
  "/category-wise",
  authorize("admin", "analyst"),
  dashboardController.getCategoryWise,
);
router.get(
  "/trends",
  authorize("admin", "analyst"),
  dashboardController.getMonthlyTrends,
);

module.exports = router;
