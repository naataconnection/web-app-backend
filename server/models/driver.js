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
  idCard1: {
    type: String,
  },
  secondaryContact: {
    type: String,
  },
  idCard2: {
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
  },
  profileImage: {
    type: String,
  }
});

module.exports = mongoose.model("driver", DriverSchema);
