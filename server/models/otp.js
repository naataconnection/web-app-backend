const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
      unique: true,
    },
    time: {
      type: Date,
      required: true,
      default: Date.now,
      index: {
        expires: 1800,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
	  required:false,
    },
	superUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "superUser",
	  required:false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otp", OTPSchema);
