const express = require("express");
const { addReview, getDoctorReviews } = require("../controllers/review.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/review", authMiddleware, addReview);
router.get("/review/:doctorId", getDoctorReviews);

module.exports = router;
