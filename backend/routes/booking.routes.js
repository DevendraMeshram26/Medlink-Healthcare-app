const express = require("express");
const {
  createBooking,
  getBookingDetailsUser,
  getAppointmentDetails,
} = require("../controllers/booking.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/booking", authMiddleware, createBooking);
router.get("/get-booking", authMiddleware, getBookingDetailsUser);
router.get("/get-appointment", authMiddleware, getAppointmentDetails);
module.exports = router;
