const mongoose = require("mongoose");

const DeliveryBoySchema = new mongoose.Schema({
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
  userCode: {
    type: String,
  },
});

module.exports = mongoose.model("deliveryBoy", DeliveryBoySchema);
