const express = require("express");
const userController = require("../controllers/user-controller");
const authenticated = require("../middlewares/authenticate");
const uploadMiddleware = require("../middlewares/upload");

const router = express.Router();

router.patch(
  "/",
  authenticated, //ผ่านการยืนยันตัวตน Login ที่ถูกต้อง //req.flie
  uploadMiddleware.single("profile"), // อัพลง Public  //req.flie
  userController.updateProfile //req.flie
);
//uploadMiddleware.array("KeyFileImage"),  แบบหลายรูป
//uploadMiddleware.fields([{ name: "Testnameimage",maxCount:2},{name:'Testnameimage2'},maxCount:1]),  แบบหลายรูป มากกว่าที่กำหนด Error
router.patch("/defaultprofile", authenticated, userController.defaultProfile);
router.patch("/updatedata", authenticated, userController.upDateData);
router.get("/:userId", authenticated, userController.getUserById);

module.exports = router;
