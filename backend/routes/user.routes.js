const express = require("express");
const router = express.Router();
const {
  RegisterController,
  LoginController,
  AuthController,
  UpdateProfileController,
  uploadAvatarController,
  ForgotPasswordController,
  ResetPasswordController,
} = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authMiddleware");
const { upload } = require("../controllers/files.controller");

router.post("/register", RegisterController);
router.post("/login", LoginController);
router.get("/get-user-data", authMiddleware, AuthController);
router.put("/update-profile", authMiddleware, UpdateProfileController);
router.post("/upload-avatar", authMiddleware, upload.single("image"), uploadAvatarController);
router.post("/forgot-password", ForgotPasswordController);
router.post("/reset-password", ResetPasswordController);

module.exports = router;
