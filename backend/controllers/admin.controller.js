const asyncHandler = require("../utils/asyncHandler");
const { doctor_details } = require("../models/doctorRegisteration.model");
const userModel = require("../models/user.model");
const Notification = require("../models/notification.model");

/**
 * Get all pending doctor applications.
 * Only accessible by admin users.
 */
const getPendingDoctors = asyncHandler(async (req, res) => {
  const pendingDoctors = await doctor_details
    .find()
    .select("-password")
    .sort({ createdAt: -1 });

  // Filter to only show doctors whose linked user account has role "pending_doctor"
  const pendingEmails = pendingDoctors.map((d) => d.email);
  const pendingUsers = await userModel
    .find({ email: { $in: pendingEmails }, role: "pending_doctor" })
    .select("email");

  const pendingEmailSet = new Set(pendingUsers.map((u) => u.email));
  const filtered = pendingDoctors.filter((d) => pendingEmailSet.has(d.email));

  return res.status(200).json({
    success: true,
    message: `${filtered.length} pending application(s) found`,
    doctors: filtered,
  });
});

/**
 * Approve a pending doctor application.
 * Changes user role from "pending_doctor" to "doctor".
 */
const approveDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  const doctorRecord = await doctor_details.findById(doctorId);
  if (!doctorRecord) {
    return res.status(404).json({
      success: false,
      message: "Doctor application not found",
    });
  }

  const user = await userModel.findOneAndUpdate(
    { email: doctorRecord.email, role: "pending_doctor" },
    { role: "doctor" },
    { new: true }
  );

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found or already approved",
    });
  }

  // Send a notification to the doctor
  await Notification.create({
    userId: user._id,
    title: "Application Approved! 🎉",
    message:
      "Congratulations! Your doctor application has been verified and approved. You now have full access to the Doctor Dashboard.",
    type: "approval",
  });

  return res.status(200).json({
    success: true,
    message: `Dr. ${doctorRecord.name} has been approved successfully`,
  });
});

/**
 * Reject a pending doctor application.
 * Changes user role from "pending_doctor" back to "user".
 */
const rejectDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  const doctorRecord = await doctor_details.findById(doctorId);
  if (!doctorRecord) {
    return res.status(404).json({
      success: false,
      message: "Doctor application not found",
    });
  }

  const user = await userModel.findOneAndUpdate(
    { email: doctorRecord.email, role: "pending_doctor" },
    { role: "user" },
    { new: true }
  );

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found or already processed",
    });
  }

  // Send a rejection notification
  await Notification.create({
    userId: user._id,
    title: "Application Update",
    message:
      "Your doctor application was not approved at this time. Please contact support for more details.",
    type: "approval",
  });

  // Remove the doctor details record
  await doctor_details.findByIdAndDelete(doctorId);

  return res.status(200).json({
    success: true,
    message: "Doctor application rejected",
  });
});

/**
 * Get notifications for the authenticated user.
 */
const getNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);

  return res.status(200).json({
    success: true,
    notifications,
  });
});

/**
 * Mark a notification as read.
 */
const markNotificationRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  await Notification.findByIdAndUpdate(notificationId, { isRead: true });

  return res.status(200).json({
    success: true,
    message: "Notification marked as read",
  });
});

module.exports = {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  getNotifications,
  markNotificationRead,
};
