const mongoose = require("mongoose");

const ManagerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  dateOfJoining: {
    type: String,
    default: null
  },
  dateOfTermination: {
    type: String,
    default: null
  },
  secondaryContact: {
    type: String,
  },
  idCard: {
    type: String,
    default: null
  },
  emergencyContact: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  userCode: {
    type: String,
  },
  profileImage: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("manager", ManagerSchema);
