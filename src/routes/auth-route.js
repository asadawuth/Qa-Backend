const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticateMiddleware, authController.getMe);
router.patch(
  "/changepassword",
  authenticateMiddleware,
  authController.changePassword
);
router.post("/forgotpassword", authController.verifyEmail);
router.post("/verifyotp", authController.verifyOtp);
router.patch("/resetPassword", authController.resetPassword);

module.exports = router;
