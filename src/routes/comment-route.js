const express = require("express");
const commentController = require("../controllers/comment-controller");
const authenticated = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/:titleId",
  authenticated,
  upload.fields([{ name: "commentImage", maxCount: 3 }]), // Ensure the name matches the one used in your controller
  commentController.commentInIdTitle
);

router.get(
  "/allcommentintitle/:titleId",
  authenticated,
  commentController.dataCommentInTitle
);

router.delete(
  "/delete/:titleId/:commentId", // Define route parameters
  authenticated, // Middleware to ensure user is authenticated
  commentController.deleteComment // Controller function to handle the deletion
);

router.patch(
  "/edit/:titleId/:commentId",
  authenticated,
  upload.fields([{ name: "commentImage", maxCount: 3 }]),
  commentController.editComment
);

router.post("/:commentId/like", authenticated, commentController.like);
router.post("/:commentId/dislike", authenticated, commentController.dislike);

module.exports = router;
