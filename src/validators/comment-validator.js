const Joi = require("joi");

const checkCommentSchema = Joi.object({
  titleId: Joi.number().integer().positive().required(),
  commentId: Joi.number().integer().positive().required(),
});

const checkIdCommentSchema = Joi.object({
  commentId: Joi.number().integer().positive().required(),
});

const checkLikeDislikesSchema = Joi.object({
  titleId: Joi.number().integer().positive().required(),
  commentId: Joi.number().integer().positive().required(),
});

exports.checkCommentSchema = checkCommentSchema;
exports.checkIdCommentSchema = checkIdCommentSchema;
exports.checkLikeDislikesSchema = checkLikeDislikesSchema;
