const mongoose = require("mongoose");
const Review = require("../models/review.model");
const { doctor_details } = require("../models/doctorRegisteration.model");
const Booking = require("../models/booking.model");
const asyncHandler = require("../utils/asyncHandler");

const addReview = asyncHandler(async (req, res) => {
  const { patientId, doctorId, rating, comment } = req.body;

  if (!patientId || !doctorId || !rating) {
    return res.status(400).json({ message: "Missing required fields", success: false });
  }

  // Check if patient has a completed appointment with this doctor
  const hasCompletedAppointment = await Booking.findOne({
    patient: patientId,
    doctor: doctorId,
    status: 'completed'
  });

  if (!hasCompletedAppointment) {
    return res.status(403).json({
      message: "You can only review doctors after a completed appointment.",
      success: false
    });
  }

  // Check if review already exists
  const existingReview = await Review.findOne({ patient: patientId, doctor: doctorId });
  if (existingReview) {
    return res.status(400).json({
      message: "You have already reviewed this doctor.",
      success: false
    });
  }

  const review = await Review.create({
    patient: patientId,
    doctor: doctorId,
    rating,
    comment
  });

  // Calculate new average rating
  const reviews = await Review.find({ doctor: doctorId });
  const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const avgRating = totalRating / reviews.length;

  await doctor_details.findByIdAndUpdate(doctorId, {
    avgRating: avgRating.toFixed(1),
    reviewCount: reviews.length
  });

  res.status(201).json({
    message: "Review added successfully",
    success: true,
    data: review
  });
});

const getDoctorReviews = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  const reviews = await Review.find({ doctor: doctorId })
    .populate("patient", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: reviews
  });
});

module.exports = {
  addReview,
  getDoctorReviews
};
