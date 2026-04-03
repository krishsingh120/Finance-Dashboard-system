const BadRequestError = require("../errors/badRequest.error");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      throw new BadRequestError(messages);
    }
    next();
  };
};

module.exports = validate;
