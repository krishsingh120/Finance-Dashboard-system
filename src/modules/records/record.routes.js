const { Router } = require("express");
const recordController = require("./record.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/rbac.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  createRecordSchema,
  updateRecordSchema,
} = require("./record.validator");

const router = Router();

router.use(authenticate);

// viewer + analyst + admin → read
router.get(
  "/",
  authorize("admin", "analyst", "viewer"),
  recordController.getAllRecords,
);
router.get(
  "/:id",
  authorize("admin", "analyst", "viewer"),
  recordController.getRecordById,
);

// admin only → write
router.post(
  "/",
  authorize("admin"),
  validate(createRecordSchema),
  recordController.createRecord,
);
router.put(
  "/:id",
  authorize("admin"),
  validate(updateRecordSchema),
  recordController.updateRecord,
);
router.delete("/:id", authorize("admin"), recordController.deleteRecord);

module.exports = router;
