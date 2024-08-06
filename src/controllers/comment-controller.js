const fs = require("fs/promises");
const createError = require("../utils/createError");
const prisma = require("../Models/prisma");
const { upload } = require("../utils/cloudinary-service");
const { checkTitleSchema } = require("../validators/title-validator");

exports.commentInIdTitle = async (req, res, next) => {
  try {
    // Validate titleId
    const { value, error } = checkTitleSchema.validate(req.params);
    if (error) return next(error);

    const { titleId } = value;
    const { message } = req.body;
    const userId = req.user.id;

    // Prepare comment data
    const data = { userId, message };

    // Handle image upload for comment
    if (req.files.commentImage?.length > 0) {
      const commentImagePaths = req.files.commentImage.map((file) => file.path);
      data.commentImage = (
        await Promise.all(commentImagePaths.map(upload))
      ).join(",");
    }

    // Check if title exists
    const title = await prisma.title.findUnique({ where: { id: titleId } });
    if (!title) return next(createError("Cannot find Title", 400));

    // Create comment
    const comment = await prisma.commentTitle.create({
      data: {
        ...data,
        titleId,
      },
      include: {
        commentDislikes: { select: { userId: true } },
        commentLikes: { select: { userId: true } },
      },
    });

    res.status(200).json({ message: "Comment created", comment });
  } catch (err) {
    next(err);
  } finally {
    // Clean up uploaded images
    if (req.files.commentImage?.length > 0) {
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
