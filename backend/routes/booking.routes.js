const express = require("express");
const {
  createBooking,
  getBookingDetailsUser,
  getAppointmentDetails,
  updateBookingStatus,
} = require("../controllers/booking.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/booking", authMiddleware, createBooking);
router.get("/get-booking", authMiddleware, getBookingDetailsUser);
router.get("/get-appointment", authMiddleware, getAppointmentDetails);
router.put("/booking-status/:bookingId", authMiddleware, updateBookingStatus);

module.exports = router;
