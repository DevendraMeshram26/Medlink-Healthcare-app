const express = require("express");
const {
  doctorRegistration,
  doctorLogin,
  DoctorAuthController,
  getAllDoctorDetails,
  getDoctorProfile,
  doctorDetailsApplication,
  getDoctorWithSpecialization,
  upload,
} = require("../controllers/doctor.controller");
const authMiddleware = require("../middleware/authMiddleware");
const { AuthController } = require("../controllers/user.controller");
const router = express.Router();

router.post("/register-doctor", doctorRegistration);
router.post("/login-doctor", doctorLogin);
router.get("/get-doctor-data", authMiddleware, DoctorAuthController);
router.post("/apply-doctor", doctorDetailsApplication);
router.get("/get-doctors", getAllDoctorDetails);
router.get("/get-doctor-profile", getDoctorProfile);
router.get("/get-specialist", getDoctorWithSpecialization);

module.exports = router;
