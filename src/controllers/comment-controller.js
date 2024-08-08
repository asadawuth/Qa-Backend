const fs = require("fs/promises");
const createError = require("../utils/createError");
const prisma = require("../Models/prisma");
const { upload } = require("../utils/cloudinary-service");
const {
  checkCommentSchema,
  checkIdCommentSchema,
} = require("../validators/comment-validator");
const { checkTitleSchema } = require("../validators/title-validator");

exports.commentInIdTitle = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params); // Validate titleId
    if (error) return next(error);

    const { titleId } = value;
    const { message } = req.body;
    const userId = req.user.id;

    const data = { userId, message };

    if (req.files.commentImage && req.files.commentImage.length > 0) {
      const commentImagePaths = req.files.commentImage.map((file) => file.path);
      const uploadedCommentImages = await Promise.all(
        commentImagePaths.map((path) => upload(path))
      );
      data.commentImage = uploadedCommentImages.join(",");
    }

    const findTitleId = await prisma.title.findFirst({
      where: {
        id: titleId,
      },
    });

    if (!findTitleId) {
      return next(createError("Cannot update Title", 400));
    }

    data.titleId = titleId;

    const comment = await prisma.commentTitle.create({
      data,
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
    });

    res.status(200).json({ message: "Comment created", comment });
  } catch (err) {
    next(err);
  } finally {
    if (req.files.commentImage && req.files.commentImage.length > 0) {
      await Promise.all(
        req.files.commentImage.map((file) =>
          fs
            .unlink(file.path)
            .catch((err) => console.error("Error deleting commentImage:", err))
        )
      );
    }
  }
};

exports.dataCommentInTitle = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params); // id ของ title
    console.log(value);
    if (error) {
      next(error);
    }
    const { titleId } = value;

    const commentInIdTitle = await prisma.commentTitle.findMany({
      where: {
        titleId: titleId,
      },
      select: {
        id: true,
        message: true,
        commentImage: true,
        createdAt: true,
        totalLike: true,
        totalDislike: true,
        userId: true,
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
        user: {
          select: {
            id: true,
            nameWebsite: true,
            profileWebsite: true,
          },
        },
      },
    });

    if (!commentInIdTitle) {
      return next(createError("Can not found CommentId or TitleId", 400));
    }

    res.status(200).json(commentInIdTitle);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { value, error } = checkCommentSchema.validate(req.params); // titleId เลขของ titleId
    if (error) {
      return next(error);
    }

    const { titleId, commentId } = value; // เลข title  เลข comment
    console.log(titleId); // 6
    console.log(commentId); // 2
    const commentIdDelete = await prisma.commentTitle.findFirst({
      where: {
        id: commentId,
        titleId: titleId,
        userId: req.user.id,
      },
    });

    if (!commentIdDelete) {
      return next(create("ID COMMENT NOT FOUND"));
    }

    await prisma.commentTitle.delete({
      where: {
        id: commentId,
      },
    });

    res.status(200).json({ message: "Delete comment Success" });
  } catch (err) {
    next(err);
  }
};

exports.editComment = async (req, res, next) => {
  try {
    const { value, error } = checkCommentSchema.validate(req.params); // titleId เลขของ titleId
    if (error) {
      return next(error);
    }
    const { titleId, commentId } = value;
    const { message } = req.body;
    const userId = req.user.id;

    const idToEdit = await prisma.commentTitle.findFirst({
      where: {
        id: commentId,
        titleId: titleId,
        userId: userId,
      },
    });

    if (!idToEdit) {
      return next(createError("ID COMMENT NOT FOUND"));
    }

    const data = { message };

    if (req.files.commentImage && req.files.commentImage.length > 0) {
      const storyImagePaths = req.files.commentImage.map((file) => file.path);
      const storyImages = await Promise.all(
        storyImagePaths.map((path) => upload(path))
      );
      data.commentImage = storyImages.join(",");
    }

    const updatedComment = await prisma.commentTitle.update({
      where: {
        id: commentId,
      },
      data,
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
    });
    res.status(200).json({ message: "Comment updated", updatedComment });
  } catch (err) {
    next(err);
  } finally {
    if (req.files.commentImage && req.files.commentImage.length > 0) {
      await Promise.all(
        req.files.commentImage.map((file) =>
          fs
            .unlink(file.path)
            .catch((err) => console.error("Error deleting commentImage:", err))
        )
      );
    }
  }
};

exports.like = async (req, res, next) => {
  try {
    const { value, error } = checkIdCommentSchema.validate(req.params); // id commentTitle
    if (error) {
      return next(error);
    } // 500

    const { commentId } = value;
    const userId = req.user.id;

    const exisComment = await prisma.commentTitle.findUnique({
      where: {
        id: commentId,
      },
    }); // หา id ที่ Comment

    if (!exisComment) {
      return next(createError("comment does not exist", 400));
    } // หาไม่เจอ +> พังหน้าบ้าน

    const exisLike = await prisma.commentLike.findFirst({
      where: {
        userId: userId,
        commentTitleId: commentId,
      },
    }); // หา ว่า ไลท์ยัง

    const exisDislike = await prisma.commentDislike.findFirst({
      where: {
        userId: userId,
        commentTitleId: commentId,
      },
    }); // หาว่ามีดิสไลท์ยัง

    if (!exisLike) {
      // ถ้ายังไม่มีการกดไลค์
      await prisma.commentLike.create({
        data: {
          userId: userId,
          commentTitleId: commentId,
        },
      });

      await prisma.commentTitle.update({
        data: {
          totalLike: {
            increment: 1,
          },
        },
        where: {
          id: commentId,
        },
      });

      if (exisDislike) {
        await prisma.commentDislike.delete({
          where: {
            id: exisDislike.id,
          },
        });

        await prisma.commentTitle.update({
          data: {
            totalDislike: {
              decrement: 1,
            },
          },
          where: {
            id: commentId,
          },
        });
      }

      return res.status(200).json({ message: "liked" });
    }

    // ถ้ามีการกดไลค์อยู่แล้ว ลบออกจากตาราง commentLike
    await prisma.commentLike.delete({
      where: {
        id: exisLike.id,
      },
    });

    await prisma.commentTitle.update({
      data: {
        totalLike: {
          decrement: 1,
        },
      },
      where: {
        id: commentId,
      },
    });

    res.status(200).json({ message: "unliked" });
  } catch (err) {
    next(err);
  }
};

exports.dislike = async (req, res, next) => {
  try {
    const { value, error } = checkIdCommentSchema.validate(req.params); // Id Comment
    if (error) {
      return next(error);
    } // 500

    const { commentId } = value;
    const userId = req.user.id; // userId ที่กด

    const exisComment = await prisma.commentTitle.findUnique({
      where: {
        id: commentId,
      },
    });

    //   const exisComment: {
    //     id: number;  = commentId
    //     message: string | null;
    //     commentImage: string | null;
    //     createdAt: Date;
    //     totalLike: number;
    //     totalDislike: number;
    //     userId: number;
    //     titleId: number | null;
    // } | null

    if (!exisComment) {
      return next(createError("comment does not exist", 400));
    } //  id: number;  = commentId  ถ้าไม่มีก็จบเลย

    const exisDislike = await prisma.commentDislike.findFirst({
      where: {
        userId: userId,
        commentTitleId: commentId,
      },
    }); // commentDislike หา ว่า // userId ที่กด มีการกดดิสไลท์หรือยัง

    const exisLike = await prisma.commentLike.findFirst({
      where: {
        userId: userId,
        commentTitleId: commentId,
      },
    }); // commentLike หา ว่า // userId ที่กด มีการกดไลท์หรือยัง

    if (!exisDislike) {
      // ถ้ายังไม่มีการกด dislike
      await prisma.commentDislike.create({
        data: {
          userId: userId,
          commentTitleId: commentId,
        },
      });
      await prisma.commentTitle.update({
        data: {
          totalDislike: {
            increment: 1,
          },
        },
        where: {
          id: commentId,
        },
      });

      //   const a: {
      //     id: number;
      //     message: string | null;
      //     commentImage: string | null;
      //     createdAt: Date;
      //     totalLike: number;
      //     totalDislike: number;   //   increment: 1  เพิ่มขึ้นมา 1
      //     userId: number;
      //     titleId: number | null;
      // }

      if (exisLike) {
        const a = await prisma.commentLike.delete({
          where: {
            id: exisLike.id,
          },
        });

        // ลบ id  int //userId: exisLike.id userId //commentTitleId: commentId,//

        await prisma.commentTitle.update({
          data: {
            totalLike: {
              decrement: 1, // ลดลงมา 1
            },
          },
          where: {
            id: commentId,
          },
        });
      }

      return res.status(200).json({ message: "disliked" });
    }

    // ถ้ามีการกด dislike อยู่แล้ว ลบออกจากตาราง commentDislike
    await prisma.commentDislike.delete({
      where: {
        id: exisDislike.id,
      },
    });

    await prisma.commentTitle.update({
      data: {
        totalDislike: {
          decrement: 1,
        },
      },
      where: {
        id: commentId,
      },
    });

    res.status(200).json({ message: "undisliked" });
  } catch (err) {
    next(err);
  }
};
