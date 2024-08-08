const Joi = require("joi");

const checkCommentSchema = Joi.object({
  titleId: Joi.number().integer().positive().required(),
  commentId: Joi.number().integer().positive().required(),
});

exports.checkCommentSchema = checkCommentSchema;

const checkIdCommentSchema = Joi.object({
  titleId: Joi.number().integer().positive().required(),
  commentId: Joi.number().integer().positive().required(),
});

exports.checkCommentSchema = checkIdCommentSchema;
