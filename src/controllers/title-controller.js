const fs = require("fs/promises");
const createError = require("../utils/createError");
const prisma = require("../Models/prisma");
const { upload } = require("../utils/cloudinary-service");

exports.createTitle = async (req, res, next) => {
  try {
    const { titleMessage, poststory } = req.body;
    const userId = req.user.id * 1; // userId ที่ โพส
    const data = { userId };

    if (titleMessage) data.titleMessage = titleMessage;
    if (poststory) data.poststory = poststory;

    if (req.files.titleImage && req.files.titleImage[0]) {
      const titleImagePath = req.files.titleImage[0].path;
      data.titleImage = await upload(titleImagePath);
    }

    if (req.files.poststoryImage && req.files.poststoryImage.length > 0) {
      const poststoryImagePaths = req.files.poststoryImage.map(
        (file) => file.path
      );
      const uploadedPostStoryImages = await Promise.all(
        poststoryImagePaths.map((path) => upload(path))
      );
      data.poststoryImage = uploadedPostStoryImages.join(",");
    }

    console.log(data);

    const title = await prisma.title.create({ data });
    res.status(201).json({ message: "Post created", title });
  } catch (error) {
    console.error(error);
    next(createError("Failed to create post", 500));
  } finally {
    if (req.files.titleImage && req.files.titleImage[0]) {
      await fs
        .unlink(req.files.titleImage[0].path)
        .catch((err) => console.error("Error deleting titleImage:", err));
    }
    if (req.files.poststoryImage && req.files.poststoryImage.length > 0) {
      await Promise.all(
        req.files.poststoryImage.map((file) =>
          fs
            .unlink(file.path)
            .catch((err) =>
              console.error("Error deleting poststoryImage:", err)
            )
        )
      );
    }
  }
};

exports.getAllTitle = async (req, res, next) => {
  try {
    const allTitle = await prisma.title.findMany({
      select: {
        id: true,
        titleMessage: true,
        titleImage: true || null,
        createdAt: true,
        totalLike: true || 0,
        totalDislike: true || 0,
        userId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(allTitle);
  } catch (error) {
    console.log(error);
  }
};
