const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter a valid email address"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a valid password"],
      min: 6,
      max: 16,
    },
    info: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
  },
  { timestamps: true }
);

const doctor_details = new mongoose.model("doctor_details", doctorSchema);

module.exports = { doctor_details };
