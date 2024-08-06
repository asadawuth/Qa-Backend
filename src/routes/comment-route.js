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

module.exports = router;
