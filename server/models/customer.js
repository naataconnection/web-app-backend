const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  companyName: {
    type: String,
  },
  department: {
    type: String,
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
  secondaryContact: {
    type: String,
  },
  userCode: {
    type: String,
  },
  gst: {
    type: String,
  },
  profileImage: {
    type: String,
  }
});

module.exports = mongoose.model("customer", CustomerSchema);
