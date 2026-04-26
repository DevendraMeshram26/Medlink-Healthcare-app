const express = require("express");
const router = express.Router();
const {
  RegisterController,
  LoginController,
  AuthController,
  UpdateProfileController,
} = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", RegisterController);
router.post("/login", LoginController);
router.get("/get-user-data", authMiddleware, AuthController);
router.put("/update-profile", authMiddleware, UpdateProfileController);

module.exports = router;
