const express = require("express");
const hitstoryController = require("../controllers/history-controller");
const authenticated = require("../middlewares/authenticate");

const router = express.Router();

router.get("/title/:userId", authenticated, hitstoryController.userCreateTitle);
router.get(
  "/comment/:userId",
  authenticated,
  hitstoryController.userIdCreateComment
);

module.exports = router;
