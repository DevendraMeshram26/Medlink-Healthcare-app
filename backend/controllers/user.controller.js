const userModel = require("../models/user.model");
const { doctor_details } = require("../models/doctorRegisteration.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const { sendOTPEmail } = require("../utils/mailer");

/**
 * Register a new user.
 * Hashes the password before saving.
 */
const RegisterController = asyncHandler(async (req, res) => {
  const existingUser = await userModel.findOne({ email: req.body.email });
  if (existingUser) {
    return res
      .status(409)
      .send({ message: "User already exists", success: false });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPassword;

  const newUser = new userModel(req.body);
  await newUser.save();

  res.status(201).send({ message: "Registered successfully", success: true });
});

/**
 * Login an existing user.
 * Returns a JWT token and user data WITHOUT the password.
 */
const LoginController = asyncHandler(async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(404)
      .send({ message: "User not found", success: false });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .send({ message: "Invalid email or password", success: false });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // SECURITY: Strip password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  // Attach doctorId if user is a doctor
  if (user.role === "doctor") {
    const docInfo = await doctor_details.findOne({ email: user.email });
    if (docInfo) {
      userResponse.doctorId = docInfo._id;
    }
  }

  res.status(200).send({
    message: "Login Success",
    success: true,
    data: userResponse,
    token: token,
  });
});

/**
 * Get authenticated user data.
 * Returns user data WITHOUT the password.
 */
const AuthController = asyncHandler(async (req, res) => {
  // SECURITY: Use select("-password") to exclude password from query
  const user = await userModel
    .findOne({ _id: req.body.userId })
    .select("-password");

  if (!user) {
    return res
      .status(404)
      .send({ message: "User not found", success: false });
  }

  const userResponse = user.toObject();

  // Attach doctorId if user is a doctor
  if (user.role === "doctor") {
    const docInfo = await doctor_details.findOne({ email: user.email });
    if (docInfo) {
      userResponse.doctorId = docInfo._id;
    }
  }

  res.status(200).send({
    success: true,
    data: userResponse,
  });
});

/**
 * Update the authenticated user's profile (name and/or email).
 */
const UpdateProfileController = asyncHandler(async (req, res) => {
  const { userId, name, email } = req.body;

  // Build update object with only provided fields
  const updateFields = {};
  if (name) updateFields.name = name;
  if (email) {
    // Check if new email is already taken by another user
    const emailTaken = await userModel.findOne({ email, _id: { $ne: userId } });
    if (emailTaken) {
      return res.status(409).send({
        message: "Email is already in use by another account",
        success: false,
      });
    }
    updateFields.email = email;
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(userId, updateFields, { new: true })
    .select("-password");

  if (!updatedUser) {
    return res.status(404).send({ message: "User not found", success: false });
  }

  res.status(200).send({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

const { uploadOnCloudinary } = require("../utils/cloudinary");

/**
 * Upload an avatar to Cloudinary and update the user's profilePicture field.
 */
const uploadAvatarController = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send({ message: "No image provided", success: false });
  }

  // Upload to Cloudinary
  const cloudinaryResponse = await uploadOnCloudinary(file.path);

  if (!cloudinaryResponse) {
    return res.status(500).send({ message: "Failed to upload image", success: false });
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(userId, { profilePicture: cloudinaryResponse.secure_url }, { new: true })
    .select("-password");

  if (!updatedUser) {
    return res.status(404).send({ message: "User not found", success: false });
  }

  res.status(200).send({
    success: true,
    message: "Profile picture updated successfully",
    data: updatedUser,
  });
});

/**
 * Controller to handle Forgot Password requests.
 * Generates a 6-digit OTP code, sets its expiry to 15 minutes, saves it to the database, and sends it to the user.
 */
const ForgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Please provide an email address", success: false });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).send({ message: "No user found with this email address", success: false });
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiration (15 minutes from now)
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 15);

  user.resetPasswordOTP = otp;
  user.resetPasswordExpires = expiry;
  await user.save();

  // Dispatch email asynchronously
  sendOTPEmail(email, otp);

  res.status(200).send({
    message: "OTP sent successfully",
    success: true,
  });
});

/**
 * Controller to handle Reset Password requests.
 * Compares the entered OTP with the stored OTP, verifies that it hasn't expired, hashes the new password, and saves it.
 */
const ResetPasswordController = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).send({ message: "Please provide all required fields", success: false });
  }

  if (newPassword.length < 6) {
    return res.status(400).send({ message: "Password must be at least 6 characters long", success: false });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).send({ message: "User not found", success: false });
  }

  // Check if OTP matches and is not expired
  if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
    return res.status(400).send({ message: "Invalid verification code", success: false });
  }

  if (new Date() > new Date(user.resetPasswordExpires)) {
    return res.status(400).send({ message: "Verification code has expired", success: false });
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  user.resetPasswordOTP = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.status(200).send({
    message: "Password reset successful. Please log in with your new password.",
    success: true,
  });
});

module.exports = {
  RegisterController,
  LoginController,
  AuthController,
  UpdateProfileController,
  uploadAvatarController,
  ForgotPasswordController,
  ResetPasswordController,
};
