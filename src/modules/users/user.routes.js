const { Router } = require("express");
const userController = require("./user.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/rbac.middleware");
const validate = require("../../middlewares/validate.middleware");
const { updateRoleSchema, updateStatusSchema } = require("./user.validator");

const router = Router();

// all routes need authentication
router.use(authenticate);

// own profile — all roles
router.get("/me", userController.getMe);

// admin only routes
router.get("/", authorize("admin"), userController.getAllUsers);
router.get("/:id", authorize("admin"), userController.getUserById);
router.patch(
  "/:id/role",
  authorize("admin"),
  validate(updateRoleSchema),
  userController.updateRole,
);
router.patch(
  "/:id/status",
  authorize("admin"),
  validate(updateStatusSchema),
  userController.updateStatus,
);
router.delete("/:id", authorize("admin"), userController.deleteUser);

module.exports = router;
