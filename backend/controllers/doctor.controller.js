const { doctor } = require("../models/doctor.model");
const { doctor_details } = require("../models/doctorRegisteration.model");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const asyncHandler = require("../utils/asyncHandler");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/**
 * Register a new doctor account (Step 1: basic credentials).
 */
const doctorRegistration = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await doctor_details.findOne({ email });

  if (userExist) {
    return res.status(409).send({
      status: false,
      message: "Doctor already registered with this email",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newDoctor = new doctor_details({
    name,
    email,
    password: hashedPassword,
  });
  await newDoctor.save();

  // SECURITY: Don't return the full doctor object with password
  return res.status(201).send({
    status: true,
    message: "Doctor registered successfully",
  });
});

/**
 * Doctor login.
 */
const doctorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const doc = await doctor_details.findOne({ email });

  if (!doc) {
    return res.status(404).send({
      status: false,
      message: "Doctor not found",
    });
  }

  const docMatch = await bcrypt.compare(password, doc.password);
  if (!docMatch) {
    return res
      .status(401)
      .send({ message: "Invalid email or password", success: false });
  }

  const token = jwt.sign({ id: doc._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // SECURITY: Strip password before responding
  const docResponse = doc.toObject();
  delete docResponse.password;

  return res.status(200).send({
    status: true,
    message: "Login successful",
    token,
    doc: docResponse,
  });
});

/**
 * Submit doctor details/application (Step 2: specialization, license, etc.)
 */
const doctorDetailsApplication = asyncHandler(async (req, res) => {
  const { email, doctorInfo } = req.body;
  let {
    profilepic,
    licenseNumber,
    address,
    specialization,
    experience,
    feesPerConsultation,
    openingTime,
    closingTime,
    website,
    role,
  } = doctorInfo;

  // Sanitize input
  specialization = specialization.toLowerCase();
  openingTime = new Date(openingTime);
  closingTime = new Date(closingTime);

  const foundDoctor = await doctor_details.findOne({ email });
  if (!foundDoctor) {
    return res.status(404).json({
      message: "You are not registered with us as a doctor",
      success: false,
    });
  }

  const existingdoctorDetails = await doctor.findOne({
    _id: foundDoctor.info,
  });
  if (existingdoctorDetails) {
    return res.status(400).json({
      message: "Application already submitted",
      success: false,
    });
  }

  const doctorDetails = await doctor.create({
    email: foundDoctor.email,
    name: foundDoctor.name,
    profilepic,
    licenseNumber,
    address,
    specialization,
    experience,
    feesPerConsultation,
    openingTime,
    closingTime,
    website,
    role,
  });

  foundDoctor.info = doctorDetails._id;
  await foundDoctor.save();

  // Update the patient's main user account to have the doctor role
  await userModel.findOneAndUpdate({ email }, { role: "doctor" });

  return res.status(201).json({
    success: true,
    message: "Doctor application submitted for verification",
  });
});

/**
 * Get all doctors (with populated info), excluding passwords.
 */
const getAllDoctorDetails = asyncHandler(async (req, res) => {
  let doctors = await doctor_details.find().select("-password");

  if (!doctors || doctors.length === 0) {
    return res.status(404).json({
      message: "No doctors found",
      success: false,
    });
  }

  doctors = await doctor_details.populate(doctors, {
    path: "info",
    model: "doctor",
    select: "-status",
  });

  return res.status(200).json({
    message: "Doctors found",
    success: true,
    doctors,
  });
});

/**
 * Search doctors by specialization.
 * BUG FIX: Was hardcoded to "Dermatology" — now uses the actual query param.
 */
const getDoctorWithSpecialization = asyncHandler(async (req, res) => {
  const { specialization } = req.query;

  if (!specialization) {
    return res.status(400).json({
      message: "Specialization query parameter is required",
      success: false,
    });
  }

  const pipeline = [
    {
      $project: {
        password: 0,
      },
    },
    {
      $lookup: {
        from: "doctors",
        localField: "info",
        foreignField: "_id",
        as: "doctorInfo",
      },
    },
    {
      $match: {
        "doctorInfo.specialization": {
          $regex: new RegExp(specialization, "i"), // FIX: Use actual query param
        },
      },
    },
  ];

  const doctors = await doctor_details.aggregate(pipeline);

  if (doctors.length === 0) {
    return res.status(404).json({
      message: "No doctors found with specialization: " + specialization,
      success: false,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Doctors found",
    doctors,
  });
});

/**
 * Get a single doctor's full profile by ID.
 */
const getDoctorProfile = asyncHandler(async (req, res) => {
  const { doctorId } = req.query;
  const foundDoctor = await doctor_details
    .findOne({ _id: doctorId })
    .select("-password")
    .populate({
      path: "info",
      model: "doctor",
    });

  if (!foundDoctor) {
    return res.status(404).json({
      message: "Doctor not found",
      success: false,
    });
  }

  return res.status(200).json({
    message: "Doctor found",
    success: true,
    doctor: foundDoctor,
  });
});

/**
 * Get authenticated doctor's data.
 */
const DoctorAuthController = asyncHandler(async (req, res) => {
  const user = await doctor_details
    .findOne({ _id: req.body.userId })
    .select("-password");

  if (!user) {
    return res.status(404).send({
      message: "Doctor not found",
      success: false,
    });
  }

  res.status(200).send({
    success: true,
    data: user,
  });
});

module.exports = {
  doctorRegistration,
  doctorLogin,
  DoctorAuthController,
  doctorDetailsApplication,
  getAllDoctorDetails,
  getDoctorProfile,
  upload,
  getDoctorWithSpecialization,
};
