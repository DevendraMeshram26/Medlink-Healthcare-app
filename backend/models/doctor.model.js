const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    // doctorInfo: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "doctor_details",
    // },
    name: {
      type: String,
      required: [true, "Please Provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please Provide a name"],
    },
    profilepic: {
      type: String,
      required: [true, "Please Provide a profile picture"],
    },
    licenseNumber: {
      type: String,
      required: [true, "Please provide a license number"],
    },
    address: {
      type: String,
      required: [true, "Please enter a valid address"],
    },
    specialization: {
      type: String,
      required: [true, "Please enter a specialization"],
    },
    experience: {
      type: Number,
      required: [true, "Please enter your experience"],
    },
    feesPerConsultation: {
      type: Number,
      required: [true, "Please enter fees"],
    },
    openingTime: {
      type: Date,
      required: [true, "Please enter the opening timing"],
    },
    closingTime: {
      type: Date,
      required: [true, "Please enter the opening timing"],
    },
    website: {
      type: String,
    },

    role: {
      type: String,
      default: "doctor",
    },
    refreshToken: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "verified"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const doctor = new mongoose.model("doctor", doctorSchema);

module.exports = { doctor };
