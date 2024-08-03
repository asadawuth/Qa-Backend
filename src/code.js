// title-controller.js
// exports.createTitle = async (req, res, next) => {
//   try {
//     const { titleMessage, poststory } = req.body; // string
//     //const userId = req.user.id * 1;
//     const titleImage = req.files.titleImage[0].path; //Array
//     const poststoryImage = req.files.poststoryImage.map((file) => file.path); //Array

//     const data = { userId: req.user.id * 1 }; // ส่งจากไอดี ที่เท่าไหร่

//     if (titleMessage) {
//       data.titleMessage = titleMessage; // destructuring
//     }

//     if (poststory || "") {
//       data.poststory = poststory; // destructuring
//     }

//     if (titleImage || "") {
//       data.titleImage = await upload(titleImage);
//     }

//     if (poststoryImage.length) {
//       const uploadedPostStoryImages = await Promise.all(
//         poststoryImage.map((path) => upload(path))
//       );
//       data.poststoryImage = uploadedPostStoryImages.join(",");
//     }

//     console.log(data);

//     await prisma.title.create({ data: data });
//     res.status(201).json({ message: "Post created" });
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     next(createError("Failed to create post", 500));
//   } finally {
//     //  finally {
//     //   await fs.unlink(req.files.titleImage[0].path);
//     //   await Promise.all(
//     //     req.files.poststoryImage.map((file) => fs.unlink(file.path))
//     //   );
//     // }
//     if (req.files.titleImage && req.files.titleImage[0]) {
//       await fs
//         .unlink(req.files.titleImage[0].path)
//         .catch((err) => console.error("Error deleting titleImage:", err));
//     }
//     if (req.files.poststoryImage && req.files.poststoryImage.length > 0) {
//       await Promise.all(
//         req.files.poststoryImage.map((file) =>
//           fs
//             .unlink(file.path)
//             .catch((err) =>
//               console.error("Error deleting poststoryImage:", err)
//             )
//         )
//       );
//     }
//   }
// };

/*
exports.like = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params); // เป็นเลข
    if (error) {
      return next(error);
    } // พัง

    const { titleId } = value; // destructuring ได้ออกมาจะเป้น 1 2 3 4 ตามลำดับของ title id
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
    // หาตาราง titleLike
    // ที่มี userId // id ที่เท่าไหร่ก็ว่ากันไป
    // ที่มี titleId // ที่เท่าไหร่ก็ว่ากันไป

    if (!exisLike) {
      // ถ้ายังไม่มีการกดไลท์
      await prisma.titleLike.create({
        data: {
          userId: userId,
          titleId: titleId,
        },
      });
      // ศร้างที่ตาราง titleLike id เป็น Auto เลข 1 2 3  ตามลำดับ
      // userId ที่ใช้ titleId โพสที่เท่าไหร่
      //
      await prisma.title.update({
        data: {
          totalLike: {
            increment: 1, // เพิ่มในตาราง title.totalLike += 1
          },
        },
        where: {
          id: titleId,
        },
      });
      return res.status(200).json({ message: "liked" });
    }

    // ถ้ามีอยู่แล้ว ลบ ออกจากตาราง titleLike
    await prisma.titleLike.delete({
      where: {
        id: exisLike.id,
      },
    });

    await prisma.title.update({
      data: {
        totalLike: {
          decrement: 1, // เพิ่มในตาราง title.totalLike -= 1
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

    if (!exisDislike) {
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
      return res.status(200).json({ message: "disliked" });
    }

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
*/

// exports.editTitle = async (req, res, next) => {
//   try {
//     const { value, error } = checkTitleSchema.validate(req.params);
//     if (error) {
//       return next(error);
//     }

//     const { titleId } = value;
//     const { titleMessage } = req.body;
//     const userId = req.user.id;

//     console.log(`idเลขของtitle ${titleId} เลขไอดีที่โพส : ${userId}`);

//     const existingTitle = await prisma.title.findFirst({
//       where: {
//         id: titleId,
//         userId: userId,
//       },
//     }); // หาตามนี้เลย id เลขของ title ${titleId} เลขไอดีที่ โพส : ${userId}

//     if (!existingTitle) {
//       return next(createError("Can not update Title", 400));
//     }

//     const data = {};

//     if (titleMessage) {
//       data.titleMessage = titleMessage;
//     } // ข้อความ data.titleMessage = ตัวที่ส่งมา

//     if (req.files.titleImage && req.files.titleImage[0]) {
//       const titleImagePath = req.files.titleImage[0].path;
//       data.titleImage = await upload(titleImagePath);
//     } //มีปล่าวมีก็อัพโหลด รูป แบบ 1 รูป

//     // Update the title in the database
//     // const updatedTitle =
//     const EditTitle = await prisma.title.update({
//       where: {
//         id: titleId,
//       },
//       // data,
//       // include: {
//       //   titleLikes: {
//       //     select: {
//       //       userId: true,
//       //     },
//       //   },
//       //   titleDisLikes: {
//       //     select: {
//       //       userId: true,
//       //     },
//       //   },
//       // },
//     });

//     res.status(200).json({ message: "Title updated successfully" });
//     console.log(EditTitle);
//   } catch (err) {
//     next(err);
//   } finally {
//     if (req.files.titleImage && req.files.titleImage[0]) {
//       await fs
//         .unlink(req.files.titleImage[0].path)
//         .catch((err) => console.error("Error deleting titleImage:", err));
//     }
//   }
// };

// const handleEditTitle = async (e) => {
//   e.preventDefault();
//   try {
//     const formdata = new FormData();
//     if (titleMessageInput.titleMessage) {
//       formdata.append("titleMessage", titleMessageInput.titleMessage);
//     }
//     if (file) {
//       formdata.append("titleImage", file);
//     }
//     setLoading(true);
//     await editTitle(titleId, formdata);
//     setAllTitle([allTitle]);
//     window.location.reload(true);
//     onClose();
//   } catch (error) {
//     console.log(error);
//   } finally {
//     setLoading(false);
//   }
// };
