const Joi = require("joi");

const createRecordSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().required(),
  date: Joi.date().iso().optional(),
  notes: Joi.string().max(500).optional().allow(""),
});

const updateRecordSchema = Joi.object({
  amount: Joi.number().positive().optional(),
  type: Joi.string().valid("income", "expense").optional(),
  category: Joi.string().optional(),
  date: Joi.date().iso().optional(),
  notes: Joi.string().max(500).optional().allow(""),
}).min(1); // kam se kam ek field required
