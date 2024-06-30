const fs = require("fs/promises");
const createError = require("../utils/createError");
const prisma = require("../Models/prisma");
const { upload } = require("../utils/cloudinary-service");

exports.createTitle = async (req, res, next) => {
  try {
    const { titleMessage, poststory } = req.body; // string
    //const userId = req.user.id * 1;
    const titleImage = req.files.titleImage[0].path; //Array
    const poststoryImage = req.files.poststoryImage.map((file) => file.path); //Array

    const data = { userId: req.user.id * 1 }; // ส่งจากไอดี ที่เท่าไหร่

    if (titleMessage) {
      data.titleMessage = titleMessage; // destructuring
    }

    if (poststory) {
      data.poststory = poststory; // destructuring
    }

    if (titleImage) {
      data.titleImage = await upload(titleImage);
    }

    if (poststoryImage.length) {
      const uploadedPostStoryImages = await Promise.all(
        poststoryImage.map((path) => upload(path))
      );
      data.poststoryImage = uploadedPostStoryImages.join(",");
    }

    console.log(data);

    await prisma.title.create({ data: data });
    res.status(201).json({ message: "Post created" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(createError("Failed to create post", 500));
  } finally {
    await fs.unlink(req.files.titleImage[0].path);
    await Promise.all(
      req.files.poststoryImage.map((file) => fs.unlink(file.path))
    );
  }
};
