const fs = require("fs/promises");

const createError = require("../utils/createError");
const prisma = require("../Models/prisma");
const { upload } = require("../utils/cloudinary-service");
const {
  checkUserIdSchema,
  updateDataSchema,
} = require("../validators/user-validator");

exports.updateProfile = async (req, res, next) => {
  try {
    console.log(req.file);
    if (!req.file) {
      return next(createError(400, "profile image is require"));
    }

    const response = {};

    if (req.file) {
      const url = await upload(req.file.path);
      response.profileWebsite = url;
      console.log(url);
      await prisma.user.update({
        data: {
          profileWebsite: url,
        },
        where: {
          id: req.user.id,
        },
      });
    }
    res.status(200).json(response);
  } catch (err) {
    next(err);
  } finally {
    if (req.file.path) {
      fs.unlink(req.file.path);
    }
  }
};
// multipart/form-data pnpm add multer upload.js เก็บไฟล์
//req.file
// {
//   fieldname: 'qwerty',
//   originalname: 'bg.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'public',  // ปลายทางที่จะให้เก็บ
//   filename: '171648246442210.jpg',  // ชื่อรูป
//   path: 'public\\171648246442210.jpg', // ตำแหน่งรูป
//   size: 44124 // ขนาดไฟล์
// }

//กรณี เกิน 2 รูปขึ้นไป
//req.files
//req.files = [ ]

exports.defaultProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      return next(createError(404, "User not found."));
    }

    if (user.profileWebsite) {
      await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          profileWebsite: null,
        },
      });
    }

    res.status(200).json({ message: "Delete profile successfully" });
  } catch (err) {
    next(err);
  }
};

exports.upDateData = async (req, res, next) => {
  try {
    // Validate request body
    const { value, error } = updateDataSchema.validate(req.body);
    console.log(value);
    if (error) {
      return next(error);
    }

    const userId = req.user.id;

    // Find user data by userId
    const userData = await prisma.user_data.findFirst({
      where: { userId: userId },
    });

    if (!userData) {
      return next(createError(404, "User not found"));
    }

    await prisma.user_data.update({
      where: { userId: userId },
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        nickName: value.nickName,
        tel: value.tel,
        age: value.age,
        sex: value.sex,
        nationality: value.nationality,
        address: value.address,
        pinMapGps: value.pinMapGps,
      },
    });
    res.status(200).json({ message: "Update Success", userData });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { error } = checkUserIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const userId = +req.params.userId;
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        User_data: true,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    //ณวมตาราง
    const mergedUser = {
      ...user,
      ...user.User_data,
    };
    delete mergedUser.User_data;
    delete mergedUser.password;

    res.status(200).json({ user: mergedUser });
  } catch (err) {
    next(err);
  }
};
