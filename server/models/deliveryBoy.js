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
  profileImage: {
    type: String,
  }
});

module.exports = mongoose.model("deliveryBoy", DeliveryBoySchema);
