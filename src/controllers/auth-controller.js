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
let checkuser;

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    // req.body
    // { nameWebsite : value }
    // { emailOrMobile : value }
    // { confirmPassword : value}
    // {   mobile Or email: }
    //console.log(value);
    if (error) {
      return next(error); //ไปที่ ErrorMiddlerware
    }
    value.password = await bcrypt.hash(value.password, 12);
    //delete value.confirmPassword;
    //console.log(value); // เบลอ Password
    const user = await prisma.user.create({
      data: value,
    });
    // สร้างที่ตาราง
    // สร้างต่อ
    await prisma.user_data.create({
      data: {
        user: {
          connect: {
            id: user.id, // สัมพันกับ  user id === user_data id
          },
        },
        firstName: "",
        lastName: "",
        nickName: "",
        tel: "",
        age: "",
        sex: "",
        nationality: "",
        address: "",
        pinMapGps: "",
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
  } catch (err) {
    next(err); //ไปที่ ErrorMiddlerware
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
  } catch (err) {
    next(err); //ไปที่ ErrorMiddlerware
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ user: req.user });
  // Ex   {
  //     "user": {
  //         "id": 1,
  //         "nameWebsite": "Asadawuth",
  //         "email": "taodewy@gmail.com",
  //         "mobile": null,
  //         "profileWebsite": "https://res.cloudinary.com/dlqp6n6mk/image/upload/v1722666909/dyf7njhbguxv3nrby1nx.jpg"
  //     }
  // }
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
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { error } = verifyEmailSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const email = req.body.email;
    //   {
    //                "user": {
    //                      "id": 1,
    //                      "nameWebsite": "Asadawuth",
    // req.body.email  =    "email": "taodewy@gmail.com",
    //                      "mobile": null,
    //                      "profileWebsite": "https://res.cloudinary.com/dlqp6n6mk/image/upload/v1722666909/dyf7njhbguxv3nrby1nx.jpg"
    //     }
    // }
    const user = await prisma.user.findUnique({
      where: { email },
    }); // // req.body.email  =    "email": "taodewy@gmail.com",
    if (!user) {
      return next(createError("Your emailor not found", 400)); // ไม่มีหรือหาไม่เจอ "Your emailormobile not found" 400
    }
    const payload = { userId: user.id }; // เลขไอดี obj ที่มี key ชื่อ userId
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || "aSD", {
      expiresIn: "30m",
    });
    checkuser = user;
    console.log(checkuser);
    delete user.password;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USEREMAIL,
        pass: process.env.PASSWORD,
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
  } catch (err) {
    next(err);
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
    const user = await prisma.user.findUnique({
      where: { id: checkuser.id },
    });
    if (!user) {
      return next(createError("User not found", 404));
    }
    delete user.password;
    if (otpFromUser === otpFromEmail) {
      return res.status(200).json({ message: "OTP matched", user });
    } else {
      return res.status(400).json({ message: "OTP not matched" });
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // ตรวจสอบ request body ที่ส่งมา
    const { value, error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const user = await prisma.user.findFirst({ where: { id: checkuser.id } });
    if (!user) {
      return next(createError("User not found", 404));
    }

    const newPasswordHash = await bcrypt.hash(value.newPassword, 12);
    await prisma.user.update({
      where: { id: checkuser.id },
      data: { password: newPasswordHash }, // แก้ไขชื่อ key เป็น data แทน user
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    next(error);
  }
};
