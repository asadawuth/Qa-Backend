const Joi = require("joi");
//.trim "  John  " => "John"
const registerSchema = Joi.object({
  nameWebsite: Joi.string().trim().required(),
  emailOrMobile: Joi.alternatives([
    Joi.string().email(),
    Joi.string().pattern(/^[0-9]{10}$/),
  ])
    .required()
    .strip(), // ขึ้นต้นด้วย 0-9 มี10ตัวเท่านั้น
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{4,30}$/)
    .trim()
    .required(), // password มีขั้นต่ำ6 สุดที่ 30
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
  mobile: Joi.forbidden().when("emailOrMobile", {
    is: Joi.string().pattern(/^[0-9]{10}$/),
    then: Joi.string().default(Joi.ref("emailOrMobile")),
  }),
  email: Joi.forbidden().when("emailOrMobile", {
    is: Joi.string().email(),
    then: Joi.string().default(Joi.ref("emailOrMobile")),
  }),
});

exports.registerSchema = registerSchema;

const loginSchema = Joi.object({
  emailOrMobile: Joi.string().required(),
  password: Joi.string().required(),
});

exports.loginSchema = loginSchema;

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().trim().required(),
  newPassword: Joi.string()
    .pattern(/^[a-zA-Z0-9]{4,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).trim().required(),
});

exports.changePasswordSchema = changePasswordSchema;

const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

exports.verifyEmailSchema = verifyEmailSchema;

const verifyOtpSchema = Joi.object({
  otp: Joi.string()
    .length(4)
    .pattern(/^[0-9]+$/)
    .required(),
});

exports.verifyOtpSchema = verifyOtpSchema;

const resetPasswordSchma = Joi.object({
  newPassword: Joi.string()
    .pattern(/^[a-zA-Z0-9]{4,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).trim().required(),
});

exports.resetPasswordSchma = resetPasswordSchma;
