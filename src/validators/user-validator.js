const Joi = require("joi");

const checkUserIdSchema = Joi.object({
  userId: Joi.number().integer().required().positive(),
});

exports.checkUserIdSchema = checkUserIdSchema;

const updateDataSchema = Joi.object({
  firstName: Joi.string().max(50).optional(), // ตัวอักษรไม่เกิน 50
  lastName: Joi.string().max(50).optional(), // ตัวอักษรไม่เกิน 50
  nickName: Joi.string().max(25).optional(), // ตัวอักษรไม่เกิน 25
  tel: Joi.string()
    .pattern(/^[0-9]{1,10}$/)
    .optional(), // ไม่เกิน10 ต้องเป็นเลขเท่านั้น
  age: Joi.string()
    .pattern(/^[0-9]{1,3}$/)
    .optional(), // ตัวอักษร ต้องเป็นเลขไม่เกิน 3 หลัก
  sex: Joi.string().valid("Male", "Female", "Thirdgender").optional(), // ระบุได้แค่ Male หรือ Female หรือ Thirdgender
  nationality: Joi.string().optional(),
  address: Joi.optional(), // optional field
  pinMapGps: Joi.optional(), // optional field
});

exports.updateDataSchema = updateDataSchema;
