const createError = require("../utils/createError");
const prisma = require("../Models/prisma");

exports.userCreateTitle = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return next(createError("UserId have a not found", 400));
    }

    const titles = await prisma.title.findMany({
      where: {
        userId: parseInt(userId),
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
      orderBy: {
        createdAt: "desc",
      },
    });

    titles.forEach((title) => {
      delete title.poststory;
      delete title.poststoryImage;
    });

    res.status(200).json(titles);
  } catch (error) {
    console.log(error);
  }
};

exports.userIdCreateComment = async (req, res, next) => {
  const userId = req.params.userId;

  if (!userId) {
    return next(createError("UserId have a not found", 400));
  }

  try {
    const comments = await prisma.commentTitle.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        commentLikes: {
          select: {
            userId: true,
          },
        },
        commentDislikes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    comments.forEach((comment) => {
      delete comment.userId;
    });
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
  }
};
