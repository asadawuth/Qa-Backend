const fs = require("fs/promises");
const createError = require("../utils/createError");
const prisma = require("../Models/prisma");
const { upload } = require("../utils/cloudinary-service");
const {
  checkCommentSchema,
  checkLikeDislikesSchema,
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
        user: {
          select: {
            id: true,
            nameWebsite: true,
            profileWebsite: true,
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

exports.commentId = async (req, res, next) => {
  try {
    const { value, error } = checkIdCommentSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const { commentId } = value;
    const userId = req.user.id;

    const commentData = await prisma.commentTitle.findFirst({
      where: {
        id: commentId,
        userId: userId,
      },
      select: {
        // เอาแค่นี้พอจะเอาไป Edit
        id: true,
        message: true,
        commentImage: true,
      },
      include: {
        commentLikes: {
          select: {
            userId: true,
          },
        },
        commentDislikes: {
          // Updated field name to match your schema
          select: {
            userId: true,
          },
        },
      },
    });

    if (!commentData) {
      return next(createError("Cannot find CommentId", 400));
    }

    res.status(200).json(commentData);
  } catch (error) {
    next(error);
  }
};

exports.editComment = async (req, res, next) => {
  try {
    const { value, error } = checkCommentSchema.validate(req.params); // titleId เลขของ titleId
    if (error) {
      return next(error);
    } // ไม่มีเไม่เจอพัง 500

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
      return next(createError("ID COMMENT NOT FOUND", 400));
    }

    const data = { message };

    if (req.files.commentImage && req.files.commentImage.length > 0) {
      const storyImagePaths = req.files.commentImage.map((file) => file.path);
      const storyImages = await Promise.all(
        storyImagePaths.map((path) => upload(path))
      );
      data.commentImage = storyImages.join(",");
    }

    if (!data.message && !data.commentImage) {
      return next(createError("Must create text or image", 400));
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
        user: {
          select: {
            id: true,
            nameWebsite: true,
            profileWebsite: true,
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
    const { value, error } = checkLikeDislikesSchema.validate(req.params); // เอา เลขไอดี ของ titleId commentId
    if (error) {
      return next(error);
    } // ไม่มีเไม่เจอพัง 500

    const { titleId, commentId } = value;
    const userId = req.user.id;

    // หาเลขไอดี ของ ตาราง title
    const exisTitle = await prisma.title.findUnique({
      where: { id: titleId },
    });
    if (!exisTitle) {
      return next(createError("Title not found", 400));
    } // ไม่เจอ หน้าบ้าน 400

    // หาทั้ง Id title Id comment
    const exisComment = await prisma.commentTitle.findUnique({
      where: { id: commentId, titleId: titleId },
    });

    if (!exisComment) {
      return next(createError("Comment not found", 400));
    } // ไม่เจอ หน้าบ้าน 400

    // ตาราง commentLike ดูว่า กดไปยัง
    const exisLike = await prisma.commentLike.findFirst({
      where: { userId: userId, commentTitleId: commentId },
    });

    // ตาราง commentDislike ดูว่ากดไปยัง
    const exisDislike = await prisma.commentDislike.findFirst({
      where: { userId: userId, commentTitleId: commentId },
    });

    // ยังไม่มีใครมากดไลท์
    if (!exisLike) {
      const a = await prisma.commentLike.create({
        //เพิ่มในตาราว commentLike id = int auto number  // userId = userId // commentTitleId = commentId
        data: { userId: userId, commentTitleId: commentId },
      });

      await prisma.commentTitle.update({
        where: {
          id: commentId,
        },
        data: {
          totalLike: { increment: 1 }, // ตาราง commentTitle  totalLike +1
        },
      });

      if (exisDislike) {
        // ถ้ามีการ Dislike อยู่่ ลบตาราง commentDislike
        await prisma.commentDislike.delete({
          where: { id: exisDislike.id }, // exisDislike id  userId commentTitleId
        });

        await prisma.commentTitle.update({
          where: { id: commentId },
          data: { totalDislike: { decrement: 1 } }, // totalDislike -1 ที่ตาราง commentTitle
        });
      }

      return res.status(200).json({ message: "liked" });
    } else {
      await prisma.commentLike.delete({
        where: { id: exisLike.id },
      }); // ลบตารางไลท์

      await prisma.commentTitle.update({
        where: { id: commentId },
        data: { totalLike: { decrement: 1 } }, // ลดมา 1
      });

      return res.status(200).json({ message: "unliked" });
    }
  } catch (err) {
    console.error("Error in like endpoint:", err);
    next(err);
  }
};

exports.dislike = async (req, res, next) => {
  try {
    const { value, error } = checkLikeDislikesSchema.validate(req.params); // เอา เลขไอดี ของ titleId commentId
    if (error) {
      return next(error);
    } // ไม่มีเไม่เจอพัง 500

    const { titleId, commentId } = value;
    const userId = req.user.id;

    // หาเลขไอดี ของ ตาราง title
    const exisTitle = await prisma.title.findUnique({
      where: { id: titleId },
    });
    if (!exisTitle) {
      return res.status(400).json({ message: "Title not found" });
    } // ไม่เจอ หน้าบ้าน 400

    // หาทั้ง Id title Id comment
    const exisComment = await prisma.commentTitle.findUnique({
      where: { id: commentId, titleId: titleId },
    });
    if (!exisComment) {
      return res.status(400).json({ message: "Comment not found" });
    } // ไม่เจอ หน้าบ้าน 400

    // ตาราง commentDislike ดูว่า กดไปยัง
    const exisDislike = await prisma.commentDislike.findFirst({
      where: { userId: userId, commentTitleId: commentId },
    });

    // ตาราง commentlike ดูว่า กดไปยัง
    const exisLike = await prisma.commentLike.findFirst({
      where: { userId: userId, commentTitleId: commentId },
    });

    if (!exisDislike) {
      // ถ้ายังไม่มีใครมา ดิสไลท์ คือไม่มีในตาราง commentDislikes
      await prisma.commentDislike.create({
        data: { userId: userId, commentTitleId: commentId },
      });

      await prisma.commentTitle.update({
        where: { id: commentId },
        data: { totalDislike: { increment: 1 } },
      }); // เพิ่ม totalDislike 1

      if (exisLike) {
        await prisma.commentLike.delete({
          where: { id: exisLike.id },
        }); // แต่เคยกดไลท์ไว้ ลบตารางที่มีไลท์ ตาราง commentLike

        await prisma.commentTitle.update({
          where: { id: commentId },
          data: { totalLike: { decrement: 1 } },
        }); // ลด totalLike ?ี่ ตางราง commentTitle
      }

      return res.status(200).json({ message: "disliked" });
    } else {
      await prisma.commentDislike.delete({
        where: { id: exisDislike.id },
      }); // ลบ

      await prisma.commentTitle.update({
        where: { id: commentId },
        data: { totalDislike: { decrement: 1 } }, // -1
      });

      return res.status(200).json({ message: "undisliked" });
    }
  } catch (err) {
    console.error("Error in dislike endpoint:", err);
    next(err);
  }
};
