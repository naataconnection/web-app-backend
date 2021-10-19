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
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  vendorID: {
    type: String,
  },
  gst: {
    type: String,
  },
});

module.exports = mongoose.model("customer", CustomerSchema);
