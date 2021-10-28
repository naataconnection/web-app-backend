const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  age: {
    type: String,
  },
  dateOfJoining: {
    type: String,
    default: null
  },
  dateOfTermination: {
    type: String,
    default: null
  },
  drivingLicense: {
    type: String,
  },
  drivingLicenseType: {
    type: String,
  },
  drivingLicenseExpiryDate: {
    type: Date,
  },
  kyc: {
    type: String,
  },
  secondaryContact: {
    type: String,
  },
  idCard: {
    type: String,
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
  vehicle:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle"
  },
  deliveryBoy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "deliveryBoy"
  }
});

module.exports = mongoose.model("driver", DriverSchema);
