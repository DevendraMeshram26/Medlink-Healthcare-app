const userModel = require("../models/user.model");
const { doctor_details } = require("../models/doctorRegisteration.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");

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

module.exports = {
  RegisterController,
  LoginController,
  AuthController,
  UpdateProfileController,
  uploadAvatarController,
};
