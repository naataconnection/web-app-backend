const mongoose = require("mongoose");

const ManagerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  dateOfJoining: {
    type: String
  },
  dateOfTermination: {
    type: String
  },
  secondaryContact: {
    type: String,
  },
  // Photo
  //   idCard: {
  //     type: String,
  //   },
  emergencyContact: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  userCode: {
    type: String,
  },
});

module.exports = mongoose.model("manager", ManagerSchema);
