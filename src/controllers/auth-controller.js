const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  verifyEmailSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} = require("../validators/auth-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../Models/prisma");
const createError = require("../utils/createError");
const nodemailer = require("nodemailer");
let storedOTP = null;

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    //console.log(value);
    if (error) {
      return next(error); //ไปที่ ErrorMiddlerware
    }
    value.password = await bcrypt.hash(value.password, 12);
    //delete value.confirmPassword;
    //console.log(value);
    const user = await prisma.user.create({
      data: value,
    });

    await prisma.user_Profile.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        firstName: null,
        lastName: null,
        nickName: null,
        tel: null,
        age: null,
        sex: null,
        nationality: null,
        address: null,
        pinMapGps: null,
      },
    });
    const payload = { userId: user.id }; // เลขไอดี
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || "SD", {
      expiresIn: process.env.JWT_EXPIRE,
    });
    delete user.password;
    res.status(201).json({ accessToken, user });

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
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // select * from user where email = emailOrmobile OR mobile = emailOrmobile
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: value.emailOrMobile }, { mobile: value.emailOrMobile }],
      },
    });
    if (!user) {
      return next(createError("invaild credential", 400));
    }

    const isMatch = await bcrypt.compare(value.password, user.password);
    //console.log(value);
    if (!isMatch) {
      return next(createError("invaild credential", 400));
    }
    const payload = { userId: user.id }; // เลขไอดี obj ที่มี key ชื่อ userId
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || "aSD", {
      expiresIn: process.env.JWT_EXPIRE,
    });
    delete user.password;
    //console.log("AccessToken", accessToken);
    res.status(200).json({ accessToken, user });
  } catch (error) {
    next(error); //ไปที่ ErrorMiddlerware
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};

exports.changePassword = async (req, res, next) => {
  try {
    const { value, error } = changePasswordSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const userId = req.user.id; // มีค่าเท่ากับ req.userid ที่ส่งมา
    const user = await prisma.user.findUnique({
      where: { id: userId }, // หาที่ id = userId ไอดีที่ส่งมาขอ
    });

    if (!user) {
      return next(createError("User not found", 404));
    }

    const isMatch = await bcrypt.compare(value.oldPassword, user.password);

    if (!isMatch) {
      return next(createError("Incorrect old password", 400));
    }

    const newPasswordHash = await bcrypt.hash(value.newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    });
    delete user.password;
    res.status(200).json({ message: "Password changed successfully", user });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { error } = verifyEmailSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const email = req.body.email;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(createError("Your emailor not found", 400)); // ไม่มีหรือหาไม่เจอ "Your emailormobile not found" 400
    }
    const payload = { userId: user.id }; // เลขไอดี obj ที่มี key ชื่อ userId
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || "aSD", {
      expiresIn: "10s",
    });
    delete user.password;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "taodewy@gmail.com",
        pass: "ykxa aamv ukvv ytpj",
      },
    });
    const mailOptions = {
      from: "taodewy@gmail.com",
      to: user.email,
      subject: "YOUR OTP WEDSITE Q&A",
      text: `YOUR OTP ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP:", error);
        return next(error);
      } else {
        console.log("OTP email sent:", info.response);
        storedOTP = otp;
        res.status(200).json({
          message: "Database has an email and OTP sent successfully.",
          user,
          accessToken,
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const otpFromUser = parseInt(req.body.otp);
    const otpFromEmail = storedOTP * 1;

    if (otpFromUser === otpFromEmail) {
      return res.status(200).json({ message: "OTP matched" });
    } else {
      return res.status(400).json({ message: "OTP not matched" });
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // Validate input
    const { value, error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((e) => e.message).join(", ") });
    }

    // Check user authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;

    // Find user by ID
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(value.newPassword, 12);

    // Update user's password
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    next(error);
  }
};
