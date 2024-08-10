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

    if (titleMessage) data.titleMessage = titleMessage; // หัวข้อ string
    if (poststory) data.poststory = poststory; // เรื่องราว string

    if (
      !titleMessage ||
      typeof titleMessage !== "string" ||
      titleMessage.length === 0 ||
      titleMessage.trim() === ""
    ) {
      return next(createError("Titlemassage is empyty", 400));
    }

    // if (poststory && poststory.length > 65535) {
    //   return next(createError("Post story is too long", 400));
    // }

    // if (
    //   !titleMessage ||
    //   typeof titleMessage !== "string" ||
    //   titleMessage.length === 0
    //   // || titleMessage.length > 35
    // ) {
    //   return next(
    //     createError("Guess massage String less than 35 characters", 400)
    //   );
    // }

    if (req.files.titleImage && req.files.titleImage[0]) {
      // ภาพแบบเดียว
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

    res.status(200).json({ message: "Post created", title });
  } catch (err) {
    next(err);
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

exports.getIdtitle = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const dataTitleId = await prisma.title.findFirst({
      where: {
        id: parseInt(value.titleId),
        userId: req.user.id,
      },
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
    console.log(dataTitleId);
    if (!dataTitleId) {
      return next(createError("Can not found TitleId", 400));
    }
    delete dataTitleId.poststoryImage;
    delete dataTitleId.poststory;
    delete dataTitleId.createdAt;
    res.status(200).json(dataTitleId);
  } catch (err) {
    next(err);
  }
};

exports.editTitle = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const { titleId } = value;
    const { titleMessage } = req.body;
    const userId = req.user.id;

    console.log(`idเลขของtitle ${titleId} เลขไอดีที่โพส : ${userId}`);

    const existingTitle = await prisma.title.findFirst({
      where: {
        id: titleId,
        userId: userId,
      },
    }); // หาตามนี้เลย id เลขของ title ${titleId} เลขไอดีที่ โพส : ${userId}

    if (!existingTitle) {
      return next(createError("Can not update Title", 400));
    }

    const data = {};

    if (titleMessage) {
      data.titleMessage = titleMessage;
    } // ข้อความ data.titleMessage = ตัวที่ส่งมา

    if (req.files.titleImage && req.files.titleImage[0]) {
      const titleImagePath = req.files.titleImage[0].path;
      data.titleImage = await upload(titleImagePath);
    } //มีปล่าวมีก็อัพโหลด รูป แบบ 1 รูป

    // Update the title in the database
    // const editTitle =
    const title = await prisma.title.update({
      where: {
        id: titleId,
      },
      data: data, // Ensure data is passed here
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

    res.status(200).json({ message: "Title updated successfully", title }); //, title: editTitle
    //console.log(EditTitle);
  } catch (err) {
    next(err);
  } finally {
    if (req.files.titleImage && req.files.titleImage[0]) {
      await fs
        .unlink(req.files.titleImage[0].path)
        .catch((err) => console.error("Error deleting titleImage:", err));
    }
  }
};

exports.getAllTitle = async (req, res, next) => {
  try {
    const allTitle = await prisma.title.findMany({
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
  } catch (err) {
    next(err);
  }
};

exports.like = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params); // เลขไอดี titleId
    if (error) {
      return next(error);
    }

    const { titleId } = value; // เลขไอดดีตาราง
    const userId = req.user.id; // เลข user ที่กด

    const exisPost = await prisma.title.findUnique({
      where: {
        id: value.titleId,
      },
    }); // หาไอดีตาราง title

    if (!exisPost) {
      return next(createError("title is not found", 400));
    } // ถ้าไม่มี

    const exisLike = await prisma.titleLike.findFirst({
      where: {
        userId: userId,
        titleId: titleId,
      },
    }); // หา user ที่ กด ไลท์ไปแล้ว ใน ตาราง titleLike

    const exisDislike = await prisma.titleDislike.findFirst({
      where: {
        userId: userId,
        titleId: titleId,
      },
    }); //ภ้ามีคนมากดไลท์แล้ว ในตาราง titleDislike

    if (!exisLike) {
      // ถ้ายังไม่มีการกดไลค์
      await prisma.titleLike.create({
        data: {
          userId: userId,
          titleId: titleId,
        },
      }); // เพิ่ม userId  กับ id ตาราง ที่ดิสไลท์

      await prisma.title.update({
        data: {
          totalLike: {
            increment: 1,
          },
        },
        where: {
          id: titleId,
        },
      }); // อัพตาราง title = titleId

      if (exisDislike) {
        await prisma.titleDislike.delete({
          where: {
            id: exisDislike.id,
          },
        }); //กดไปแล้ว ลบ userId req.param // titleid

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
    const { value, error } = checkTitleSchema.validate(req.params); // title id
    if (error) {
      return next(error);
    } // พัง 500

    const { titleId } = value;
    const userId = req.user.id; // id user ที่จะกด

    const exisPost = await prisma.title.findUnique({
      where: {
        id: value.titleId,
      }, // ไม่มีไอดีในตาราง
    });

    if (!exisPost) {
      return next(createError("title is not found", 400));
    } // ไม่มีไอดีในตาราง

    const exisDislike = await prisma.titleDislike.findFirst({
      where: {
        userId: userId,
        titleId: titleId,
      },
    }); // มีกดมากดยัง

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
    // else
    await prisma.titleDislike.delete({
      where: {
        id: exisDislike.id, // id  ที่ userId : userId // titleId : titleId
      },
    });

    await prisma.title.update({
      data: {
        totalDislike: {
          decrement: 1, // -1
        },
      },
      where: {
        id: titleId,
      },
    });

    res.status(200).json({ message: "undisliked" });
  } catch (err) {
    next(err);
  }
};

exports.deleteTitle = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params); // titleId เลขของ titleId
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
    next(err);
  }
};

exports.editAllTitle = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { titleId } = value;
    const { titleMessage, poststory } = req.body;
    const userId = req.user.id; // userId ที่ โพส
    const data = { userId }; // data = { userId : เลขId }

    if (titleMessage) data.titleMessage = titleMessage; // หัวข้อ string
    if (
      !titleMessage ||
      typeof titleMessage !== "string" ||
      titleMessage.length === 0
      // || titleMessage.length > 35
    ) {
      return next(
        createError("Guess massage String less than 35 characters", 400)
      );
    }
    if (poststory) data.poststory = poststory; // เรื่องราว string
    console.log(`idเลขของtitle ${titleId} เลขไอดีที่โพส : ${userId}`);

    const existingTitle = await prisma.title.findFirst({
      where: {
        id: titleId,
        userId: userId,
      },
    }); // หาตามนี้เลย id เลขของ title ${titleId} เลขไอดีที่ โพส : ${userId}

    if (!existingTitle) {
      return next(createError("Can not update Title", 400));
    }

    if (req.files.titleImage && req.files.titleImage[0]) {
      // ภาพแบบเดียว
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

    const editTitle = await prisma.title.update({
      data,
      where: {
        id: titleId,
      },
      data: data, // Ensure data is passed here
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
    console.log(editTitle);
    res.status(200).json({ message: "Edit Post", editTitle }); //title: editTitle
  } catch (err) {
    next(err);
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

exports.allDataTitle = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const dataTitleId = await prisma.title.findFirst({
      where: {
        id: value.titleId,
      },
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
        user: {
          select: {
            id: true,
            nameWebsite: true,
            profileWebsite: true,
          },
        },
      },
    });
    if (!dataTitleId) {
      return next(createError("Can not found TitleId", 400));
    }
    res.status(200).json(dataTitleId);
  } catch (err) {
    next(err);
  }
};

exports.totalComment = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params); // Validate titleId
    if (error) {
      return next(error);
    }

    const { titleId } = value;

    const totalComments = await prisma.commentTitle.count({
      where: {
        titleId: titleId,
      },
    });

    res.status(200).json({ totalComments });
  } catch (err) {
    next(err);
  }
};
