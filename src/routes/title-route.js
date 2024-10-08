const express = require("express");
const titleController = require("../controllers/title-controller");
const authenticated = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/titles", authenticated, titleController.getPage);

router.post(
  "/",
  authenticated,
  upload.fields([
    { name: "titleImage", maxCount: 1 },
    { name: "poststoryImage", maxCount: 3 },
  ]),
  titleController.createTitle
);

/*
router.get("/alltitle", authenticated, titleController.getAllTitle);
*/

router.post("/:titleId/like", authenticated, titleController.like);
router.post("/:titleId/dislike", authenticated, titleController.dislike);
router.delete("/:titleId", authenticated, titleController.deleteTitle);
router.get("/get/:titleId", authenticated, titleController.getIdtitle);
router.patch(
  "/edit/:titleId",
  authenticated,
  upload.fields([{ name: "titleImage", maxCount: 1 }]),
  titleController.editTitle
);
router.patch(
  "/editalltitle/:titleId",
  authenticated,
  upload.fields([
    { name: "titleImage", maxCount: 1 },
    { name: "poststoryImage", maxCount: 3 },
  ]),
  titleController.editAllTitle
);
router.get("/alldata/:titleId", authenticated, titleController.allDataTitle);

router.get(
  "/totalcomment/:titleId",
  authenticated,
  titleController.totalComment
);

module.exports = router;
