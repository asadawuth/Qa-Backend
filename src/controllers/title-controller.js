const fs = require("fs/promises");
const createError = require("../utils/createError");
const prisma = require("../Models/prisma");
const { upload } = require("../utils/cloudinary-service");
const { checkTitleSchema } = require("../validators/title-validator");

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

    //console.log(data);

    const title = await prisma.title.create({
      data,
      include: {
        titleLikes: {
          select: {
            userId: true,
          },
        },
        titleDisLikes: {
          select: {
            userId: true,
          },
        },
      },
    });

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
      // select: {
      //   id: true,
      //   titleMessage: true,
      //   titleImage: true || null,
      //   createdAt: true,
      //   totalLike: true || 0,
      //   totalDislike: true || 0,
      //   userId: true,
      // },
      // orderBy: {
      //   createdAt: "desc",
      // },

      select: {
        id: true,
        titleMessage: true,
        titleImage: true,
        createdAt: true,
        totalLike: true,
        totalDislike: true,
        userId: true,
        titleLikes: {
          select: {
            userId: true,
          },
        },
        titleDisLikes: {
          select: {
            userId: true,
          },
        },
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

exports.like = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const { titleId } = value;
    const userId = req.user.id;

    const exisPost = await prisma.title.findUnique({
      where: {
        id: value.titleId,
      },
    });

    if (!exisPost) {
      return next(createError("post does not exist", 400));
    }

    const exisLike = await prisma.titleLike.findFirst({
      where: {
        userId: userId,
        titleId: titleId,
      },
    });

    const exisDislike = await prisma.titleDislike.findFirst({
      where: {
        userId: userId,
        titleId: titleId,
      },
    });

    if (!exisLike) {
      // ถ้ายังไม่มีการกดไลค์
      await prisma.titleLike.create({
        data: {
          userId: userId,
          titleId: titleId,
        },
      });

      await prisma.title.update({
        data: {
          totalLike: {
            increment: 1,
          },
        },
        where: {
          id: titleId,
        },
      });

      if (exisDislike) {
        await prisma.titleDislike.delete({
          where: {
            id: exisDislike.id,
          },
        });

        await prisma.title.update({
          data: {
            totalDislike: {
              decrement: 1,
            },
          },
          where: {
            id: titleId,
          },
        });
      }

      return res.status(200).json({ message: "liked" });
    }

    // ถ้ามีการกดไลค์อยู่แล้ว ลบออกจากตาราง titleLike
    await prisma.titleLike.delete({
      where: {
        id: exisLike.id,
      },
    });

    await prisma.title.update({
      data: {
        totalLike: {
          decrement: 1,
        },
      },
      where: {
        id: titleId,
      },
    });

    res.status(200).json({ message: "unliked" });
  } catch (err) {
    next(err);
  }
};

exports.dislike = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const { titleId } = value;
    const userId = req.user.id;

    const exisPost = await prisma.title.findUnique({
      where: {
        id: value.titleId,
      },
    });

    if (!exisPost) {
      return next(createError("post does not exist", 400));
    }

    const exisDislike = await prisma.titleDislike.findFirst({
      where: {
        userId: userId,
        titleId: titleId,
      },
    });

    const exisLike = await prisma.titleLike.findFirst({
      where: {
        userId: userId,
        titleId: titleId,
      },
    });

    if (!exisDislike) {
      // ถ้ายังไม่มีการกด dislike
      await prisma.titleDislike.create({
        data: {
          userId: userId,
          titleId: titleId,
        },
      });

      await prisma.title.update({
        data: {
          totalDislike: {
            increment: 1,
          },
        },
        where: {
          id: titleId,
        },
      });

      if (exisLike) {
        await prisma.titleLike.delete({
          where: {
            id: exisLike.id,
          },
        });

        await prisma.title.update({
          data: {
            totalLike: {
              decrement: 1,
            },
          },
          where: {
            id: titleId,
          },
        });
      }

      return res.status(200).json({ message: "disliked" });
    }

    // ถ้ามีการกด dislike อยู่แล้ว ลบออกจากตาราง titleDislike
    await prisma.titleDislike.delete({
      where: {
        id: exisDislike.id,
      },
    });

    await prisma.title.update({
      data: {
        totalDislike: {
          decrement: 1,
        },
      },
      where: {
        id: titleId,
      },
    });

    res.status(200).json({ message: "undisliked" });
  } catch (error) {
    next(error);
  }
};

exports.deleteTitle = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const existTitle = await prisma.title.findFirst({
      where: {
        id: value.titleId,
        userId: req.user.id,
      },
    });

    if (!existTitle) {
      return next(createError("Can not delete Title", 400));
    }

    await prisma.title.delete({
      where: {
        id: existTitle.id,
      },
    });
    res.status(200).json({ message: "Delete success" });
  } catch (err) {
    console.log(err);
  }
};
