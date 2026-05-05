const express = require("express");
const {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  getNotifications,
  markNotificationRead,
} = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Admin routes (all require authentication)
router.get("/admin/pending-doctors", authMiddleware, getPendingDoctors);
router.put("/admin/approve-doctor/:doctorId", authMiddleware, approveDoctor);
router.put("/admin/reject-doctor/:doctorId", authMiddleware, rejectDoctor);

// Notification routes (for all authenticated users)
router.get("/notifications", authMiddleware, getNotifications);
router.put("/notifications/:notificationId/read", authMiddleware, markNotificationRead);

module.exports = router;
