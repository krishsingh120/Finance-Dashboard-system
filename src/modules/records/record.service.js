const recordRepository = require("./record.repository");
const NotFoundError = require("../../errors/notFound.error");
const BadRequestError = require("../../errors/badRequest.error");

class RecordService {
  buildFilters(query) {
    const filters = {};

    if (query.type) filters.type = query.type;
    if (query.category) filters.category = query.category.toLowerCase();

    // date range filter
    if (query.startDate || query.endDate) {
      filters.date = {};
      if (query.startDate) filters.date.$gte = new Date(query.startDate);
      if (query.endDate) filters.date.$lte = new Date(query.endDate);
    }

    return filters;
  }

  async createRecord(userId, data) {
    return await recordRepository.create({ ...data, userId });
  }

  async getAllRecords(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = this.buildFilters(query);
    const { records, total } = await recordRepository.findAll(
      filters,
      skip,
      limit,
    );

    return {
      records,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async getRecordById(id) {
    const record = await recordRepository.findById(id);
    if (!record) throw new NotFoundError("Record not found");
    return record;
  }

  async updateRecord(id, data) {
    const record = await recordRepository.findById(id);
    if (!record) throw new NotFoundError("Record not found");

    if (data.amount && data.amount <= 0) {
      throw new BadRequestError("Amount must be greater than 0");
    }

    return await recordRepository.update(id, data);
  }

  async deleteRecord(id) {
    const record = await recordRepository.findById(id);
    if (!record) throw new NotFoundError("Record not found");

    await recordRepository.softDelete(id);
    return { message: "Record deleted successfully" };
  }
}

module.exports = new RecordService();
