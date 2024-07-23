const express = require("express");
const titleController = require("../controllers/title-controller");
const authenticated = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/",
  authenticated,
  upload.fields([
    { name: "titleImage", maxCount: 1 },
    { name: "poststoryImage", maxCount: 3 },
  ]),
  titleController.createTitle
);

router.get("/alltitle", authenticated, titleController.getAllTitle);

module.exports = router;
