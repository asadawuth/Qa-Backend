const { registerSchema } = require("../validators/auth-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../Models/prisma");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    //console.log(value);
    if (error) {
      next(error); //ไปที่ ErrorMiddlerware
    }
    value.password = await bcrypt.hash(value.password, 12);
    //console.log(value);
    const user = await prisma.user.create({
      data: value,
    });

    const payload = { userId: user.id }; // เลขไอดี
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || "SD", {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.status(201).json({ accessToken });

    /* await prisma.user.create({
        data: {
          nameWebsite:
          emailOrMobile 
          email: null หรือ value.emailOrMobile
          mobile: value.emailOrMobile หรือ  null
          password
          comfirmPassword
        }
    }); */
  } catch (error) {
    next(error); //ไปที่ ErrorMiddlerware
  }
};

exports.login = async (req, res, next) => {
  try {
  } catch (error) {
    next(error); //ไปที่ ErrorMiddlerware
  }
};
