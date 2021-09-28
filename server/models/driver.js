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
  // Photo Upload
  //   drivingLicense: {
  //     type: String,
  //   },
  drivingLicenseType: {
    type: String,
  },
  drivingLicenseExpiryDate: {
    type: Date,
  },
  //   Photo Upload
  //   kyc: [
  //     {
  //       type: String,
  //     },
  //   ],
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

module.exports = mongoose.model("driver", DriverSchema);
