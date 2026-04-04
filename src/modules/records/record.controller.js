const recordService = require("./record.service");
const asyncHandler = require("../../utils/asyncHandler");
const { successResponse } = require("../../utils/response");

class RecordController {
  createRecord = asyncHandler(async (req, res) => {
    const record = await recordService.createRecord(req.user.id, req.body);
    return successResponse(res, 201, "Record created successfully", record);
  });

  getAllRecords = asyncHandler(async (req, res) => {
    const data = await recordService.getAllRecords(req.query);
    return successResponse(res, 200, "Records fetched successfully", data);
  });

  getRecordById = asyncHandler(async (req, res) => {
    const record = await recordService.getRecordById(req.params.id);
    return successResponse(res, 200, "Record fetched successfully", record);
  });

  updateRecord = asyncHandler(async (req, res) => {
    const record = await recordService.updateRecord(req.params.id, req.body);
    return successResponse(res, 200, "Record updated successfully", record);
  });

  deleteRecord = asyncHandler(async (req, res) => {
    const result = await recordService.deleteRecord(req.params.id);
    return successResponse(res, 200, result.message);
  });
}

module.exports = new RecordController();
