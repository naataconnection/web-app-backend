const mongoose = require("mongoose");

const ManagerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  joinDate: {
    type: Date,
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
  employeeID: {
    type: String,
  },
});

module.exports = mongoose.model("manager", ManagerSchema);
