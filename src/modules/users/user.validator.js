const Joi = require("joi");

const updateRoleSchema = Joi.object({
  role: Joi.string().valid("viewer", "analyst", "admin").required(),
});

const updateStatusSchema = Joi.object({
  isActive: Joi.boolean().required(),
});

module.exports = { updateRoleSchema, updateStatusSchema };
