const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
    unique: true,
  },
  time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("otp", OTPSchema);
