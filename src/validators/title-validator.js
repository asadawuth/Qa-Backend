const Joi = require("joi");

const checkTitleSchema = Joi.object({
  titleId: Joi.number().integer().positive().required(),
});

exports.checkTitleSchema = checkTitleSchema;
