const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
    unique: true,
  },
  serviceRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "serviceRequest",
  },
});

module.exports = mongoose.model("order", OrderSchema);
