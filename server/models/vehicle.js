const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  vehicleCode:{
    type:String,
    unique:true
  },
  vehicleType: {
    type: Number,
    // 0 -> Owned, 1 -> rented
    required: true,
  },
  vehicleMakeYear: {
    type: Number,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  bodyType: {
    type: Number,
    required: true,
    // 0 -> Open, 1 -> Closed
  },
  registrationNumber: {
    type: String,
  },
  color: {
    type: String,
  },
  permit: [
    {
      type: String,
      // State  or India.
    },
  ],
  registrationDate: {
    type: Date,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerAddress: {
    type: String,
    required: true,
  },
  ownerPhone: {
    type: String,
    required: true,
  },
  insuranceEndDate: {
    type: Date,
  },

  // Photo storage
  //   insurance: {
  //       type: String
  //   }
  dailyRent: {
    type: Number,
    default: 0,
  },
  costPerKM: {
    type: Number,
    default: 0,
  },
  costPerDay: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("vehicle", VehicleSchema);
